# frozen_string_literal: true

module Teacher
  extend ActiveSupport::Concern

  include CheckboxCallback
  include LessonsCache

  TRIAL_LIMIT = 250
  TRIAL_START_DATE = Date.parse('1-9-2015') # September 1st 2015

  included do
    has_many :units
    has_one :user_subscription
    has_one :subscription, through: :user_subscription
    has_one :referrer_user
    has_many :referrals_users
    has_one :referrals_user, class_name: 'ReferralsUser', foreign_key: :referred_user_id

    after_update :update_ortto_newsletter_subscription_status
  end

  class << self
    delegate :first, :find, :where, :all, :count, to: :scope

    def scope
      User.teacher
    end
  end

  def update_ortto_newsletter_subscription_status
    return unless saved_changes['send_newsletter']

    OrttoIntegration::UpdateNewsletterSubscriptionStatusWorker.perform_async(email, send_newsletter)
  end

  # Occasionally teachers are populated in the view with
  # a single blank classroom.
  def has_classrooms?
    classrooms_i_teach.any? && !classrooms_i_teach.all?(&:new_record?)
  end

  # TODO: classrooms_i_teach is also a defined association on User
  # we should eliminate one of these
  def classrooms_i_teach
    Classroom.find_by_sql(base_sql_for_teacher_classrooms)
  end

  def classrooms_i_own
    Classroom.find_by_sql("#{base_sql_for_teacher_classrooms} AND ct.role = 'owner'")
  end

  def classrooms_i_coteach
    Classroom.find_by_sql("#{base_sql_for_teacher_classrooms} AND ct.role = 'coteacher'")
  end

  def classroom_ids_i_coteach_or_have_a_pending_invitation_to_coteach
    all_ids = RawSqlRunner.execute(
      <<-SQL
        SELECT
          DISTINCT(coteacher_classroom_invitations.classroom_id) AS invitation_id,
          classrooms_teachers.classroom_id
        FROM users
        LEFT JOIN invitations
          ON invitations.invitee_email = users.email
          AND invitations.archived = false
        LEFT JOIN coteacher_classroom_invitations
          ON coteacher_classroom_invitations.invitation_id = invitations.id
        LEFT JOIN classrooms_teachers
          ON classrooms_teachers.user_id = #{id}
          AND classrooms_teachers.role = 'coteacher'
        WHERE users.id = #{id}
      SQL
    ).to_a

    Set.new.tap { |ids| all_ids.each { |row| ids.merge(row.values) } }
  end

  # rubocop:disable Metrics/CyclomaticComplexity
  def ids_of_classroom_teachers_and_coteacher_invitations_that_i_coteach_or_am_the_invitee_of(classrooms_ids_to_check=nil)
    if classrooms_ids_to_check && classrooms_ids_to_check.any?
      # if there are specific ids passed it will only return those that match
      coteacher_classroom_invitation_additional_join = "AND coteacher_classroom_invitations.classroom_id IN (#{classrooms_ids_to_check.map(&:to_i).join(', ')})"
      classrooms_teacher_additional_join = "AND classrooms_teachers.classroom_id IN (#{classrooms_ids_to_check.map(&:to_i).join(', ')})"
    end

    classrooms_teachers_ids = Set.new
    coteacher_classroom_invitation_ids = Set.new
    all_ids = RawSqlRunner.execute(
      <<-SQL
        SELECT
          coteacher_classroom_invitations.id AS coteacher_classroom_invitation_id,
          classrooms_teachers.id AS classrooms_teachers_id
        FROM users
        LEFT JOIN invitations
          ON invitations.invitee_email = users.email
          AND invitations.archived = false
        LEFT JOIN coteacher_classroom_invitations
          ON coteacher_classroom_invitations.invitation_id = invitations.id
          #{coteacher_classroom_invitation_additional_join}
        LEFT JOIN classrooms_teachers
          ON classrooms_teachers.user_id = #{id}
          AND classrooms_teachers.role = 'coteacher'
          #{classrooms_teacher_additional_join}
        WHERE users.id = #{id}
      SQL
    )

    all_ids.each do |row|
      row.each do |k,v|
        case k
        when 'coteacher_classroom_invitation_id'
          coteacher_classroom_invitation_ids << v
        when 'classrooms_teachers_id'
          classrooms_teachers_ids << v.to_i
        end
      end
    end

    {
      coteacher_classroom_invitations_ids: coteacher_classroom_invitation_ids.to_a,
      classrooms_teachers_ids: classrooms_teachers_ids.to_a
    }
  end
  # rubocop:enable Metrics/CyclomaticComplexity

  def affiliated_with_unit?(unit_id)
    RawSqlRunner.execute(
      <<-SQL
        SELECT units.id
        FROM units
        JOIN classroom_units
          ON classroom_units.unit_id = units.id
        JOIN classrooms_teachers
          ON classroom_units.classroom_id = classrooms_teachers.classroom_id
        WHERE classrooms_teachers.user_id = #{id}
          AND units.id = #{unit_id.to_i}
        LIMIT 1
      SQL
    ).to_a.any?
  end

  def students
    User.find_by_sql(
      "SELECT students.* FROM users AS teacher
      JOIN classrooms_teachers AS ct ON ct.user_id = teacher.id
      JOIN classrooms ON classrooms.id = ct.classroom_id AND classrooms.visible = TRUE
      JOIN students_classrooms AS sc ON sc.classroom_id = ct.classroom_id
      JOIN users AS students ON students.id = sc.student_id
      WHERE teacher.id = #{id}"
    )
  end

  def archived_classrooms
    Classroom.find_by_sql("#{base_sql_for_teacher_classrooms(only_visible_classrooms: false)} AND ct.role = 'owner' AND classrooms.visible = false")
  end

  # rubocop:disable Metrics/CyclomaticComplexity
  def handle_negative_classrooms_from_update_coteachers(classroom_ids=nil)
    return unless classroom_ids && classroom_ids.any?

    # destroy the existing invitation and teacher relationships
    ids_of_classroom_teachers_and_coteacher_invitations_that_i_coteach_or_am_the_invitee_of(classroom_ids).each do |k,v|
      case k
      when :classrooms_teachers_ids
        ClassroomsTeacher.where(id: v).map(&:destroy)
      when :coteacher_classroom_invitations_ids
        CoteacherClassroomInvitation.where(id: v).map(&:destroy)
      end
    end
  end
  # rubocop:enable Metrics/CyclomaticComplexity

  def handle_positive_classrooms_from_update_coteachers(classroom_ids, inviter_id)
    return unless classroom_ids && classroom_ids.any?

    new_classroom_ids = classroom_ids.map(&:to_i) - classroom_ids_i_coteach_or_have_a_pending_invitation_to_coteach.to_a.map(&:to_i)
    return unless new_classroom_ids.any?

    invitation = Invitation.create(
      invitee_email: email,
      inviter_id: inviter_id,
      invitation_type: Invitation::TYPES[:coteacher]
    )

    new_classroom_ids.each do |id|
      CoteacherClassroomInvitation.find_or_create_by(invitation: invitation, classroom_id: id)
    end
  end

  def classrooms_i_teach_with_students
    classrooms_i_teach.map{|classroom| classroom.with_students}
  end

  def classrooms_i_teach_with_student_ids
    classrooms_i_teach.map{|classroom| classroom.with_students_ids}
  end

  def classrooms_i_own_with_students
    classrooms_i_own.map{|classroom| classroom.with_students}
  end

  def classrooms_i_am_the_coteacher_for_with_a_specific_teacher_with_students(specified_teacher_id)
    classrooms_i_am_the_coteacher_for_with_a_specific_teacher(specified_teacher_id).map{|classroom| classroom.with_students}
  end

  def classrooms_i_own_that_have_coteachers
    RawSqlRunner.execute(
      <<-SQL
        SELECT
          classrooms.name AS name,
          coteacher.name AS coteacher_name,
          coteacher.email AS coteacher_email,
          coteacher.id AS coteacher_id
        FROM classrooms_teachers AS my_classrooms
        JOIN classrooms_teachers AS coteachers_classrooms
          ON coteachers_classrooms.classroom_id = my_classrooms.classroom_id
        JOIN classrooms
          ON coteachers_classrooms.classroom_id = classrooms.id
        JOIN users AS coteacher
          ON coteachers_classrooms.user_id = coteacher.id
        WHERE my_classrooms.user_id = #{id}
          AND coteachers_classrooms.role = 'coteacher'
          AND my_classrooms.role = 'owner'
      SQL
    ).to_a
  end

  def classrooms_i_own_that_have_pending_coteacher_invitations
    RawSqlRunner.execute(
      <<-SQL
        SELECT DISTINCT
          classrooms.name AS name,
          invitations.invitee_email AS coteacher_email
        FROM classrooms_teachers AS my_classrooms
        JOIN invitations
          ON invitations.inviter_id = my_classrooms.user_id
        JOIN coteacher_classroom_invitations
          ON invitations.id = coteacher_classroom_invitations.invitation_id
        JOIN classrooms
          ON coteacher_classroom_invitations.classroom_id = classrooms.id
        WHERE my_classrooms.user_id = #{id}
          AND invitations.invitation_type = '#{Invitation::TYPES[:coteacher]}'
          AND invitations.archived = false AND my_classrooms.role = 'owner'
      SQL
    ).to_a
  end


  def classroom_minis_cache
    cache = $redis.get("user_id:#{id}_classroom_minis")
    cache ? JSON.parse(cache) : nil
  end

  def classroom_minis_cache=(info)
    # TODO: move this to background worker
    $redis.set("user_id:#{id}_classroom_minis", info.to_json, {ex: 16.hours} )
  end

  def self.clear_classrooms_minis_cache(teacher_id)
    $redis.del("user_id:#{teacher_id}_classroom_minis")
  end

  def classroom_minis_info
    cache = classroom_minis_cache

    return cache if cache

    classrooms = RawSqlRunner.execute(
      <<-SQL
        SELECT
          classrooms.name AS name,
          classrooms.id AS id,
          classrooms.code AS code,
          COUNT(DISTINCT sc.id) as student_count,
          classrooms.google_classroom_id AS google_classroom_id,
          classrooms.clever_id AS clever_id,
          classrooms.created_at AS created_at,
          classrooms.grade AS grade
        FROM classrooms
        LEFT JOIN students_classrooms AS sc
          ON sc.classroom_id = classrooms.id
        LEFT JOIN classrooms_teachers
          ON classrooms_teachers.classroom_id = classrooms.id
        WHERE classrooms.visible = true
          AND classrooms_teachers.user_id = #{id}
        GROUP BY
          classrooms.name,
          classrooms.id
      SQL
    ).to_a

    counts = RawSqlRunner.execute(
      <<-SQL
        SELECT
          classrooms.id AS id, COUNT(DISTINCT acts.id)
        FROM classrooms
        FULL OUTER JOIN classroom_units AS class_units
          ON class_units.classroom_id = classrooms.id
        FULL OUTER JOIN activity_sessions AS acts
          ON acts.classroom_unit_id = class_units.id
        LEFT JOIN classrooms_teachers
          ON classrooms_teachers.classroom_id = classrooms.id
        WHERE classrooms_teachers.user_id = #{id}
          AND classrooms.visible
          AND class_units.visible
          AND acts.visible
          AND acts.is_final_score = true
        GROUP BY classrooms.id
      SQL
    ).to_a

    info = classrooms.map do |classy|
      count = counts.find { |elm| elm['id'] == classy['id'] }
      classy['activity_count'] = count ? count['count'] : 0
      classy['has_coteacher'] = ClassroomsTeacher.where(classroom_id: classy['id']).length > 1
      classy['teacher_role'] = ClassroomsTeacher.find_by(classroom_id: classy['id'], user_id: id).role
      classy
    end
    # TODO: move setter to background worker
    classroom_minis_cache=(info)
    info
  end

  def teaches_eighth_through_twelfth?
    return true if teacher_info&.in_eighth_through_twelfth?

    classrooms_i_teach
      .map(&:grade)
      .compact
      .uniq
      .any? { |grade| grade.to_i.in?(TeacherInfo::EIGHT_TO_TWELVE) }
  end

  def google_classrooms
    Classroom
      .joins(:classrooms_teachers)
      .where(classrooms_teachers: { user_id: id })
      .where.not(google_classroom_id: nil)
  end

  def clever_classrooms
    Classroom
      .joins(:classrooms_teachers)
      .where(classrooms_teachers: { user_id: id })
      .where.not(clever_id: nil)
  end

  def classroom_units(includes_value = nil)
    classroom_ids = classrooms_i_teach.map(&:id)
    if includes_value
      ClassroomUnit.where(classroom_id: classroom_ids).includes(includes_value)
    else
      ClassroomUnit.where(classroom_id: classroom_ids)
    end
  end

  # rubocop:disable Metrics/CyclomaticComplexity
  def update_teacher params
    return if !teacher?

    params.permit(
      :id,
      :name,
      :role,
      :username,
      :authenticity_token,
      :email,
      :time_zone,
      :password,
      :school_options_do_not_apply,
      :school_id,
      :send_newsletter,
      :original_selected_school_id,
      :google_id,
      :clever_id,
      :signed_up_with_google
    )

    self.validate_username = true

    are_there_school_related_errors = false
    if params[:school_options_do_not_apply] == 'false' || !params[:school_options_do_not_apply]
      if params[:school_id].blank?
        are_there_school_related_errors = true
      else
        self.school = School.find(params[:school_id])
        updated_school params[:school_id]
        find_or_create_checkbox('Add School', self)
      end
    end
    if !are_there_school_related_errors
      if update(
        username: params.key?(:username) ? params[:username] : username,
        email: params.key?(:email) ? params[:email] : email,
        name: params.key?(:name) ? params[:name] : name,
        time_zone: params.key?(:time_zone) ? params[:time_zone] : time_zone,
        password: params.key?(:password) ? params[:password] : password,
        role: params.key?(:role) ? params[:role] : role,
        send_newsletter: params.key?(:send_newsletter) ? params[:send_newsletter] : send_newsletter,
        google_id: params.key?(:google_id) ? params[:google_id] : google_id,
        clever_id: params.key?(:clever_id) ? params[:clever_id] : clever_id,
        signed_up_with_google: params.key?(:signed_up_with_google) ? params[:signed_up_with_google] : signed_up_with_google
      )
        are_there_non_school_related_errors = false
      else
        are_there_non_school_related_errors = true
      end
    end

    if are_there_school_related_errors
      response = {errors: {school: "can't be blank"}}
    elsif are_there_non_school_related_errors
      response = {errors: errors}
    else
      response = self
    end
    response
  end
  # rubocop:enable Metrics/CyclomaticComplexity

  # rubocop:disable Metrics/CyclomaticComplexity
  def updated_school(school_id)
    school = School.find_by(id: school_id)

    if subscription&.school_subscriptions&.any? && !has_matching_subscription?(self, school&.subscription)
      # then they were previously in a school with a subscription, so we destroy the relationship
      UserSubscription.find_by(user_id: id, subscription_id: subscription.id).destroy
    end

    return unless school && school.subscription

    # then we let the user subscription handle everything else
    UserSubscription.create_user_sub_from_school_sub_if_they_do_not_have_that_school_sub(self, school.subscription)
  end
  # rubocop:enable Metrics/CyclomaticComplexity

  def has_matching_subscription?(user, subscription)
    UserSubscription.exists?(user: user, subscription: subscription)
  end

  def is_premium?
    !!(subscription && subscription.expiration >= Date.current)
  end

  def getting_started_info
    checkbox_data = {
      completed: checkboxes.map(&:objective_id),
      potential: Objective.where(section: 'Getting Started')
    }
    if checkbox_data[:completed].count < checkbox_data[:potential].count
      checkbox_data
    else #checkbox data unnecessary
      false
    end
  end

  def subscription_is_expired?
    subscription && subscription.expiration < Date.current
  end

  def subscription_is_valid?
    subscription && subscription.expiration > Date.current
  end

  def teachers_activity_sessions_since_trial_start_date
    ActivitySession.where(user: students)
                   .where("completed_at >= ?", TRIAL_START_DATE)
  end

  def trial_days_remaining
    today = Date.current
    valid_subscription = subscription && subscription.expiration > today

    return nil unless valid_subscription && subscription.is_trial?

    (subscription.expiration - today).to_i
  end

  def unlink
    VitallyIntegration::UnlinkUserWorker.perform_async(id, school&.id)
    self.school = nil
    updated_school(nil)
    save
  end

  def premium_updated_or_created_today?
    return unless subscription

    [subscription.created_at, subscription.updated_at].max == Time.current.beginning_of_day
  end

  def premium_state
    if subscription
      Subscription::TRIAL_TYPES.include?(subscription.account_type) ? 'trial' : 'paid'
    elsif subscriptions.exists?
      # then they have an expired or 'locked' sub
      'locked'
    else
      'none'
    end
  end

  def is_beta_period_over?
    Date.current >= TRIAL_START_DATE
  end

  def finished_diagnostic_unit_ids_with_classroom_id_and_activity_id
    Unit.find_by_sql("SELECT DISTINCT units.id AS unit_id, cu.classroom_id AS classroom_id, activities.id AS activity_id FROM units
      JOIN classroom_units AS cu ON ca.unit_id = units.id
      JOIN activity_sessions AS actsesh ON actsesh.classroom_unit_id = cu.id
      JOIN activities AS acts ON actsesh.activity_id = acts.id
      WHERE units.user_id = #{id}
      AND acts.activity_classification_id = 4
      AND actsesh.state = 'finished'")
  end

  def finished_diagnostic_unit_ids
    Unit.find_by_sql("SELECT DISTINCT units.id FROM units
      JOIN classroom_units AS cu ON ca.unit_id = units.id
      JOIN activity_sessions AS actsesh ON actsesh.classroom_unit_id = cu.id
      JOIN activities AS acts ON actsesh.activity_id = acts.id
      WHERE units.user_id = #{id}
      AND acts.activity_classification_id = 4
      AND actsesh.state = 'finished'")
  end

  def set_and_return_lessons_cache_data
    lessons_cache = data_for_lessons_cache
    set_lessons_cache(lessons_cache)
    lessons_cache
  end

  def set_lessons_cache(lessons_data=nil)
    if !lessons_data
      lessons_data = data_for_lessons_cache
    end
    $redis.set("user_id:#{id}_lessons_array", lessons_data.to_json)
  end

  def data_for_lessons_cache
    format_initial_lessons_cache(self)
  end

  def classrooms_i_am_the_coteacher_for_with_a_specific_teacher(teacher_id)
    Classroom.find_by_sql("SELECT classrooms.* FROM classrooms
      JOIN classrooms_teachers AS ct_i_coteach ON ct_i_coteach.classroom_id = classrooms.id
      JOIN classrooms_teachers AS ct_of_owner ON ct_of_owner.classroom_id = classrooms.id
      WHERE ct_i_coteach.role = 'coteacher' AND ct_i_coteach.user_id = #{id} AND
      ct_of_owner.role = 'owner' AND ct_of_owner.user_id = #{teacher_id.to_i}")
  end

  def classrooms_i_own_that_a_specific_user_coteaches_with_me(teacher_id)
    Classroom.find_by_sql("SELECT classrooms.* FROM classrooms
      JOIN classrooms_teachers AS ct_i_own ON ct_i_own.classroom_id = classrooms.id
      JOIN classrooms_teachers AS ct_of_coteacher ON ct_of_coteacher.classroom_id = classrooms.id
      WHERE ct_i_own.role = 'owner' AND ct_i_own.user_id = #{id} AND
      ct_of_coteacher.role = 'coteacher' AND ct_of_coteacher.user_id = #{teacher_id.to_i}")
  end

  def classroom_ids_i_have_invited_a_specific_teacher_to_coteach(teacher_id)
    RawSqlRunner.execute(
      <<-SQL
        SELECT cci.classroom_id
        FROM invitations
        JOIN users AS coteachers
          ON coteachers.email = invitations.invitee_email
        JOIN coteacher_classroom_invitations AS cci
          ON cci.invitation_id = invitations.id
        WHERE coteachers.id = #{teacher_id.to_i}
          AND invitations.inviter_id = #{id}
      SQL
    ).values.flatten
  end

  def has_outstanding_coteacher_invitation?
    Invitation.exists?(invitee_email: email, invitation_type: Invitation::TYPES[:coteacher], archived: false)
  end

  def ids_and_names_of_affiliated_classrooms
    RawSqlRunner.execute(
      <<-SQL
        SELECT DISTINCT
          classrooms.id,
          classrooms.name
        FROM classrooms_teachers
        JOIN classrooms
          ON classrooms.id = classrooms_teachers.classroom_id
          AND classrooms.visible = TRUE
        WHERE classrooms_teachers.user_id = #{id}
        ORDER BY classrooms.name ASC;
      SQL
    ).to_a
  end

  def ids_and_names_of_affiliated_students(classroom_id=nil)
    students_classrooms_filter = classroom_id.blank? ? '' : " AND students_classrooms.classroom_id = #{classroom_id.to_i}"

    RawSqlRunner.execute(
      <<-SQL
        SELECT DISTINCT
          users.id,
          users.name,
          SUBSTRING(users.name FROM (position(' ' IN users.name) + 1) FOR (char_length(users.name))) || SUBSTRING(users.name FROM (1) for (position(' ' IN users.name))) AS sorting_name
        FROM classrooms_teachers
        JOIN classrooms
          ON classrooms.id = classrooms_teachers.classroom_id
          AND classrooms.visible = true
        JOIN students_classrooms
          ON students_classrooms.classroom_id = classrooms.id
          AND students_classrooms.visible = TRUE
          #{students_classrooms_filter}
        JOIN users
          ON users.id = students_classrooms.student_id
        WHERE classrooms_teachers.user_id = #{id}
        ORDER BY sorting_name ASC
      SQL
    ).to_a
  end

  def ids_and_names_of_affiliated_units
    RawSqlRunner.execute(
      <<-SQL
        SELECT DISTINCT
          units.id,
          units.name
        FROM classrooms_teachers
        JOIN classrooms_teachers AS all_affiliated_classrooms
          ON all_affiliated_classrooms.classroom_id = classrooms_teachers.classroom_id
        JOIN classrooms
          ON classrooms.id = all_affiliated_classrooms.classroom_id
          AND classrooms.visible = TRUE
        JOIN units
          ON all_affiliated_classrooms.user_id = units.user_id
          AND units.visible = TRUE
        WHERE classrooms_teachers.user_id = #{id}
        ORDER BY units.name ASC
      SQL
    ).to_a
  end

  def referral_code
    ru = referrer_user
    if ru.present?
      ru.referral_code
    else
      generate_referrer_id.referral_code
    end
  end

  def referral_link
    Rails.application.routes.url_helpers.root_url(referral_code: referral_code)
  end

  def referrals
    referrals_users.count
  end

  def earned_months
    referrals_users.where(activated: true ).count
  end

  def unredeemed_credits
    credit_transactions.sum(:amount)
  end

  def teaches_student?(student_id)
    RawSqlRunner.execute(
      <<-SQL
        SELECT 1
        FROM users
        JOIN students_classrooms
          ON users.id = students_classrooms.student_id
        JOIN classrooms_teachers
          ON students_classrooms.classroom_id = classrooms_teachers.classroom_id
          AND classrooms_teachers.user_id = #{id}
      SQL
    ).to_a.any?
  end

  def generate_referrer_id
    ReferrerUser.create(user_id: id, referral_code: "#{name.downcase.gsub(/[^a-z ]/, '').gsub(' ', '-')}-#{id}")
  end

  def assigned_students_per_activity_assigned
    ClassroomUnit.joins("JOIN unit_activities ON classroom_units.unit_id=unit_activities.unit_id")
    .joins("JOIN activities ON activities.id = unit_activities.activity_id")
    .joins("JOIN classrooms ON classrooms.id = classroom_units.classroom_id")
    .joins("JOIN classrooms_teachers ON classrooms.id=classrooms_teachers.classroom_id")
    .joins("JOIN users on users.id = classrooms_teachers.user_id")
    .where("users.id = ?", id)
    .select("assigned_student_ids, activities.id, unit_activities.created_at")
  end

  private def base_sql_for_teacher_classrooms(only_visible_classrooms: true)
    <<-SQL
      SELECT classrooms.*
      FROM classrooms_teachers AS ct
      JOIN classrooms
        ON ct.classroom_id = classrooms.id #{only_visible_classrooms ? ' AND classrooms.visible = TRUE' : nil}
      WHERE ct.user_id = #{id}
    SQL
  end
end
