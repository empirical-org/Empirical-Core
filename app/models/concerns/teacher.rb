module Teacher
  extend ActiveSupport::Concern

  include CheckboxCallback


  TRIAL_LIMIT = 250
  TRIAL_START_DATE = Date.parse('1-9-2015') # September 1st 2015

  included do
    has_many :classrooms_i_teach, foreign_key: 'teacher_id', class_name: "Classroom"
    has_many :students, through: :classrooms_i_teach, class_name: "User"
    has_many :admin_accounts_teachers,  foreign_key: 'teacher_id', class_name: "AdminAccountsTeachers"
    has_many :admin_accounts_i_am_part_of, through: :admin_accounts_teachers, class_name: "AdminAccount", source: :admin_account
    has_many :units
    has_one :user_subscription
    has_one :subscription, through: :user_subscription
  end

  class << self
    delegate :first, :find, :where, :all, :count, to: :scope

    def scope
      User.where(role: 'teacher')
    end
  end

  # Occasionally teachers are populated in the view with
  # a single blank classroom.
  def has_classrooms?
    classrooms_i_teach.any? && !classrooms_i_teach.all?(&:new_record?)
  end

  def get_classroom_minis_cache
    cache = $redis.get("user_id:#{self.id}_classroom_minis")
    cache ? JSON.parse(cache) : nil
  end

  def set_classroom_minis_cache(info)
    # TODO: move this to background worker
    $redis.set("user_id:#{self.id}_classroom_minis", info.to_json, {ex: 16.hours} )
  end

  def self.clear_classrooms_minis_cache(teacher_id)
    $redis.del("user_id:#{teacher_id}_classroom_minis")
  end

  def get_classroom_minis_info
    cache = get_classroom_minis_cache
    if cache
      return cache
    end
    info = ActiveRecord::Base.connection.execute(
    "SELECT classrooms.name AS name, classrooms.id AS id, COUNT(DISTINCT acts.id) AS activity_count, COUNT(DISTINCT students.id) AS student_count, classrooms.code AS code FROM classrooms
          LEFT OUTER JOIN students_classrooms AS sc ON sc.classroom_id = classrooms.id
          LEFT OUTER JOIN users AS students ON students.id = sc.student_id
          LEFT OUTER JOIN classroom_activities AS class_acts ON class_acts.classroom_id = classrooms.id
          LEFT OUTER JOIN activity_sessions AS acts ON acts.classroom_activity_id = class_acts.id
          WHERE classrooms.teacher_id = #{self.id} AND classrooms.visible AND ((acts.visible IS true AND acts.is_final_score IS true) OR acts IS NULL)
          GROUP BY classrooms.id"
    ).to_a
    # TODO: move setter to background worker
    set_classroom_minis_cache(info)
    info
  end

  def archived_classrooms
    Classroom.unscoped.where(teacher_id: self.id, visible: false)
  end

  def google_classrooms
    Classroom.where(teacher_id: self.id).where.not(google_classroom_id: nil)
  end

  def transfer_account
    TransferAccountWorker.perform_async(self.id, new_user.id);
  end

  def classrooms_i_teach_with_students
    classrooms_i_teach.includes(:students).map do |classroom|
      classroom_h = classroom.attributes
      classroom_h[:students] = classroom.students
      classroom_h
    end
  end

  def classroom_activities(includes_value = nil)
    classroom_ids = classrooms_i_teach.map(&:id)
    if includes_value
      ClassroomActivity.where(classroom_id: classroom_ids).includes(includes_value)
    else
      ClassroomActivity.where(classroom_id: classroom_ids)
    end
  end

  def update_teacher params
    return if !self.teacher?
    params[:role] = 'teacher' if params[:role] != 'student'
    params.permit(:id,
                  :name,
                  :role,
                  :username,
                  :authenticity_token,
                  :email,
                  :password,
                  :school_options_do_not_apply,
                  :school_id,
                  :original_selected_school_id)

    self.validate_username = true

    are_there_school_related_errors = false
    if params[:school_options_do_not_apply] == 'false'
      if params[:school_id].nil? or params[:school_id].length == 0
        are_there_school_related_errors = true
      else
        self.school = School.find(params[:school_id])
        self.updated_school params[:school_id]
        find_or_create_checkbox('Add School', self)
      end
    end
    if !are_there_school_related_errors
      if self.update_attributes(username: params[:username] || self.username,
                                        email: params[:email] || self.email,
                                        name: params[:name] || self.name,
                                        password: params[:password] || self.password,
                                        role: params[:role] || self.role)
        are_there_non_school_related_errors = false
      else
        are_there_non_school_related_errors = true
      end
    end


    if are_there_school_related_errors
      response = {errors: {school: "can't be blank"}}
    elsif are_there_non_school_related_errors
      response = {errors: self.errors}
    else
      response = self
    end
    response
  end

  def updated_school(school_id)
    new_school_sub = SchoolSubscription.find_by_school_id(school_id)
    current_sub = self.subscription
    if current_sub&.school_subscriptions&.any?
      # then they already belonged to a subscription through a school, which we destroy
      self.user_subscription.destroy
    end
    if new_school_sub
      if current_sub
        current_is_school = current_sub&.school_subscriptions.any?
        if current_is_school
          # we don't care about their old school -- give them the new school sub
          new_sub_id = new_school_sub.subscription.id
        else
          # give them the better of their personal sub or the school sub
          new_sub_id = later_expiration_date(new_school_sub.subscription, current_sub).id
        end
      else
        # they get the new sub by default
        new_sub_id = new_school_sub.subscription.id
      end
    end
    if new_sub_id
      UserSubscription.update_or_create(self.id, new_sub_id)
    end
  end



  def part_of_admin_account?
    admin_accounts_i_am_part_of.any?
  end

  def is_premium?
    if part_of_admin_account?
      true
    else
      !!(subscription && subscription.expiration >= Date.today)
    end
  end

  def getting_started_info
    checkbox_data = {
      completed: self.checkboxes.map(&:objective_id),
      potential: Objective.where(section: 'Getting Started')
    }
    if checkbox_data[:completed].count < checkbox_data[:potential].count
      checkbox_data
    else #checkbox data unnecessary
      false
    end
  end

  def subscription_is_expired?
    subscription && subscription.expiration < Date.today
  end

  def subscription_is_valid?
    subscription && subscription.expiration > Date.today
  end

  def teachers_activity_sessions_since_trial_start_date
    ActivitySession.where(user: self.students)
                   .where("completed_at >= ?", TRIAL_START_DATE)
  end

  def eligible_for_trial?
    premium_state == 'none'
  end

  def trial_days_remaining
    valid_subscription =   subscription && subscription.expiration > Date.today
    if valid_subscription && (subscription.is_not_paid?)
      (subscription.expiration - Date.today).to_i
    else
      nil
    end
  end

  def premium_updated_or_created_today?
    if subscription
      [subscription.created_at, subscription.updated_at].max == Time.zone.now.beginning_of_day
    end
  end

  def has_premium?

  end

  def premium_state
    # the beta period is obsolete -- but may break things by removing it
    if part_of_admin_account?
        'school'
    elsif subscription
      if !is_beta_period_over?
        "beta"
      elsif is_premium?
        ## returns 'trial' or 'paid'
        subscription.trial_or_paid
      elsif subscription_is_expired?
        "locked"
      end
    else
      'none'
    end
  end

  def is_beta_period_over?
    Date.today >= TRIAL_START_DATE
  end

  def later_expiration_date(sub_1, sub_2)
    sub_1.expiration > sub_2.expiration ? sub_1 : sub_2
  end

  def finished_diagnostic_unit_ids
    Unit.find_by_sql("SELECT DISTINCT units.id FROM units
      JOIN classroom_activities AS ca ON ca.unit_id = units.id
      JOIN activities AS acts ON ca.activity_id = acts.id
      JOIN activity_sessions AS actsesh ON actsesh.classroom_activity_id = ca.id
      WHERE units.user_id = #{self.id}
      AND acts.activity_classification_id = 4
      AND actsesh.state = 'finished'")
  end

end
