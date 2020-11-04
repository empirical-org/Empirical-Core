class User < ActiveRecord::Base
  include Student
  include Teacher
  include CheckboxCallback

  attr_accessor :validate_username,
                :require_password_confirmation_when_password_present

  before_validation :generate_student_username_if_absent
  before_validation :prep_authentication_terms
  before_save :capitalize_name
  after_save  :update_invitee_email_address, if: proc { email_changed? }
  after_save :check_for_school
  after_create :generate_referrer_id, if: proc { teacher? }

  has_secure_password validations: false
  has_one :auth_credential, dependent: :destroy
  has_many :user_subscriptions
  has_many :subscriptions, through: :user_subscriptions
  has_many :checkboxes
  has_many :credit_transactions
  has_many :invitations, foreign_key: 'inviter_id'
  has_many :objectives, through: :checkboxes
  has_many :user_subscriptions
  has_many :subscriptions, through: :user_subscriptions
  has_many :activity_sessions
  has_many :notifications, dependent: :delete_all
  has_one :schools_users
  has_one :sales_contact
  has_one :school, through: :schools_users
  has_many :schools_i_coordinate, class_name: 'School', foreign_key: 'coordinator_id'
  has_many :schools_i_authorize, class_name: 'School', foreign_key: 'authorizer_id'

  has_many :schools_admins, class_name: 'SchoolsAdmins'
  has_many :administered_schools, through: :schools_admins, source: :school, foreign_key: :user_id
  has_many :classrooms_teachers
  has_many :teacher_saved_activities, dependent: :destroy, foreign_key: 'teacher_id'
  has_many :activities, through: :teacher_saved_activities
  has_many :classrooms_i_teach, through: :classrooms_teachers, source: :classroom
  has_many :students_i_teach, through: :classrooms_i_teach, source: :students

  has_many :units
  has_many :classroom_units, through: :units

  has_many :students_classrooms, class_name: 'StudentsClassrooms', foreign_key: 'student_id'
  has_many :student_in_classroom, through: :students_classrooms, source: :classroom

  has_and_belongs_to_many :districts
  has_one :ip_location
  has_many :user_milestones
  has_many :milestones, through: :user_milestones
  has_many :third_party_user_ids

  has_many :blog_post_user_ratings

  has_many :change_logs

  accepts_nested_attributes_for :auth_credential

  delegate :name, :mail_city, :mail_state, to: :school, allow_nil: true, prefix: :school


  validates :name,                  presence: true,
                                    format:       {without: /\t/, message: 'cannot contain tabs'}

  validates_with ::FullnameValidator

  validates :password,              presence:     { if: :requires_password? }

  validates :email,                 presence:     { if: :email_required? },
                                    uniqueness:   { message: :taken, if: :email_required_or_present?}

  validate :username_cannot_be_an_email

  validates :clever_id,             uniqueness:   { if: :clever_id_present_and_has_changed? }

  validates :google_id, uniqueness:   { if: ->(u) { u.google_id.present? && u.student? }}

  # gem validates_email_format_of
  validates_email_format_of :email, if: :email_required_or_present?, message: :invalid



  validates :username,              presence:     { if: ->(m) { m.email.blank? && m.permanent? } },
                                    uniqueness:   { allow_blank: true, message: :taken },
                                    format:       { without: /\s/, message: :no_spaces_allowed, if: :validate_username? }

  validate :validate_flags

  TEACHER = 'teacher'
  STUDENT = 'student'
  STAFF = 'staff'
  ROLES      = [TEACHER, STUDENT, STAFF]
  SAFE_ROLES = [STUDENT, TEACHER]
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-]+(\.[a-z\d\-]+)*\.[a-z]+\z/i

  ALPHA = 'alpha'
  BETA = 'beta'
  PRIVATE = 'private'
  TESTING_FLAGS = [ALPHA, BETA, PRIVATE]
  PERMISSIONS_FLAGS = %w(auditor purchaser school_point_of_contact)
  VALID_FLAGS = TESTING_FLAGS.dup.concat(PERMISSIONS_FLAGS)

  scope :teacher, -> { where(role: TEACHER) }
  scope :student, -> { where(role: STUDENT) }

  attr_accessor :newsletter

  def testing_flag
    role == STAFF ? PRIVATE : flags.detect{|f| TESTING_FLAGS.include?(f)}
  end

  def auditor?
    flags.include?('auditor')
  end

  def utc_offset
    if time_zone.present?
      tz = TZInfo::Timezone.get(time_zone)
      tz.period_for_utc(Time.new.utc).utc_total_offset
    else
      0
    end
  end

  def purchaser?
    flags.include?('purchaser')
  end

  def school_poc?
    flags.include?('school_point_of_contact')
  end

  def redeem_credit
    balance = credit_transactions.sum(:amount)
    if balance > 0
      new_sub = Subscription.create_with_user_join(id, {account_type: 'Premium Credit',
                                                            payment_method: 'Premium Credit',
                                                            expiration: redemption_start_date + balance,
                                                            start_date: redemption_start_date,
                                                            purchaser_id: id})
      if new_sub
        CreditTransaction.create!(user: self, amount: 0 - balance, source: new_sub)
      end
      new_sub
    end
  end

  def redemption_start_date
    last_subscription = subscriptions
      .where(de_activated_date: nil)
      .where("expiration > ?", Date.today)
      .order(expiration: :asc)
      .limit(1).first

    if last_subscription.present?
      last_subscription.expiration
    else
      Date.today
    end
  end

  def subscription_authority_level(subscription_id)
    subscription = Subscription.find subscription_id
    if subscription.purchaser_id == id
        'purchaser'
    elsif subscription.schools.include?(school)
      if school.coordinator == self
        'coordinator'
      elsif school.authorizer == self
        'authorizer'
      end
    end
  end

  def eligible_for_new_subscription?
      if subscription
        # if they have a subscription it must be a trial one
        Subscription::TRIAL_TYPES.include?(subscription.account_type) || Subscription::COVID_TYPES.include?(subscription.account_type)
      else
        # otherwise they are good for purchase
        true
      end
  end

  def last_expired_subscription
    subscriptions.where("expiration <= ?", Date.today).order(expiration: :desc).limit(1).first
  end

  def subscription
    subscriptions.where("expiration > ? AND start_date <= ? AND de_activated_date IS NULL", Date.today, Date.today,).order(expiration: :desc).limit(1).first
  end

  def present_and_future_subscriptions
    subscriptions.where("expiration > ? AND de_activated_date IS NULL", Date.today).order(expiration: :asc)
  end

  def create(*args)
    super
  rescue ActiveRecord::RecordNotUnique => e
    errors[:db_level] << e
    false
  end

  def update(*args)
    super
  rescue ActiveRecord::RecordNotUnique => e
    errors[:db_level] << e
    false
  end

  def create_or_update(*args)
    super
  rescue ActiveRecord::RecordNotUnique => e
    errors[:db_level] << e
    false
  end

  def validate_username?
    validate_username.present? ? validate_username : false
  end

  def username_cannot_be_an_email
    if username =~ VALID_EMAIL_REGEX
      if id
        db_self = User.find(id)
        errors.add(:username, :invalid) unless db_self.username == username
      else
        errors.add(:username, :invalid)
      end
    end
  end

  # gets last four digits of Stripe card
  def last_four
    if stripe_customer_id
      Stripe::Customer.retrieve(stripe_customer_id).sources.data.first&.last4
    end
  end

  def safe_role_assignment role
    sanitized_role = SAFE_ROLES.find{ |r| r == role.strip }
    self.role = sanitized_role || 'user'
  end

  def self.sorting_name_sql
    <<-SQL
      substring(
        users.name from (
          position(' ' in users.name) + 1
        )
        for (
          char_length(users.name)
        )
      )
      ||
      substring(
        users.name from (
          1
        )
        for (
          position(' ' in users.name)
        )

      ) as sorting_name
    SQL
  end

  def capitalize_name
    result = name
    if name.present?
      f,l = name.split(/\s+/, 2)
      if f.present? and l.present?
        result = "#{f.capitalize} #{l.gsub(/\S+/, &:capitalize)}"
      else
        result = name.capitalize
      end
    end
    self.name = result
  end

  def admin?
    SchoolsAdmins.find_by_user_id(id).present?
  end

  def self.find_by_username_or_email(login_name)
    login_name.downcase!
    User.where("email = ? OR username = ?", login_name, login_name).first
  end

  def self.setup_from_clever(auth_hash)
    user = User.create_from_clever(auth_hash)

    d = District.find_by(clever_id: auth_hash[:info][:district])


    return user if d.nil? #FIXME: replace with ERROR("DISTRICT NOT FOUND")

    user.districts << d unless user.districts.include?(d)

    if user.teacher?
      user.create_classrooms!
    elsif user.student?
      user.connect_to_classrooms!
    end
    user
  end

  # replace with authority, cancan or something
  def role
    @role_inquirer ||= ActiveSupport::StringInquirer.new(self[:role])
  end

  def role= role
    remove_instance_variable :@role_inquirer if defined?(@role_inquirer)
    super
  end

  def sorting_name
    "#{last_name}, #{first_name}"
  end

  def student?
    role.student?
  end

  def teacher?
    role.teacher?
  end

  def staff?
    role.staff?
  end

  def permanent?
    !role.temporary?
  end

  ## Satismeter settings
  SATISMETER_PERCENT_PER_DAY = ENV['SATISMETER_PERCENT_PER_DAY'] || 10.0
  SATISMETER_ACTIVITIES_PER_STUDENT_THRESHOLD = 3.0
  SATISMETER_NEW_USER_THRESHOLD = 60.days

  def show_satismeter?
    teacher? && satismeter_feature_enabled? && satismeter_threshold_met?
  end

  def satismeter_threshold_met?
    lessons_completed = ActivitySession.for_teacher(id).completed.count(:id)
    student_count = students_i_teach.count('DISTINCT(users.id)')

    (lessons_completed.to_f / student_count) >= SATISMETER_ACTIVITIES_PER_STUDENT_THRESHOLD
  end

  # Enable for all new users and a small percentage of older users.
  def satismeter_feature_enabled?
    created_at >= SATISMETER_NEW_USER_THRESHOLD.ago ||
    Feature.in_day_bucket?(id: id, percent_per_day: SATISMETER_PERCENT_PER_DAY)
  end

  ## End satismeter

  def admins_teachers
    schools = administered_schools.includes(:users)
    if schools.any?
      schools.map{|school| school.users.ids}.flatten
    end
  end

  def refresh_token!
    update_attributes token: SecureRandom.urlsafe_base64
    save validate: false
  end

  def serialized
    "#{role.capitalize}Serializer".constantize.new(self)
  end

  def first_name= first_name
    last_name
    @first_name = first_name
    set_name
  end

  def clear_data
    ActiveRecord::Base.transaction do
      update!(
        name:      "Deleted User_#{id}",
        email:     "deleted_user_#{id}@example.com",
        username:  "deleted_user_#{id}",
        google_id: nil,
        clever_id: nil
      )
      StudentsClassrooms.where(student_id: id).update_all(visible: false)
      if auth_credential.present?
        auth_credential.destroy!
      end
      SchoolsUsers.where(user_id: id).destroy_all
    end
  end

  def last_name= last_name
    first_name
    @last_name = last_name
    set_name
  end

  def first_name
    @first_name ||= name.to_s.split("\s")[0]
  end

  def last_name
    @last_name ||= name.to_s.split("\s")[-1]
  end

  def set_name
    self.name = [@first_name, @last_name].compact.join(' ')
  end

  def generate_password
    # first we need to replace any existing spaces with hyphens
    last_name_with_spaces_replaced_by_hyphens = last_name.split(' ').join('-')
    # then we want to capitalize the first letter
    self.password = self.password_confirmation = last_name_with_spaces_replaced_by_hyphens.slice(0,1).capitalize + last_name_with_spaces_replaced_by_hyphens.slice(1..-1)
  end

  def generate_student(classroom_id)
    self.role = 'student'
    generate_username(classroom_id)
    generate_password
  end

  def clever_district_id
    clever_user.district.id
  end

  def teacher_of_student
    unless classrooms.empty?
      classrooms.first.owner
    end
  end

  def send_welcome_email
    UserMailer.welcome_email(self).deliver_now! if email.present? && !auditor?
  end

  def send_account_created_email(temp_password, admin_name)
    UserMailer.account_created_email(self, temp_password, admin_name).deliver_now! if email.present?
  end

  def send_invitation_to_non_existing_user(invitation_email_hash)
    # must be called from inviter account
    UserMailer.invitation_to_non_existing_user(invitation_email_hash).deliver_now! if email.present?
  end

  def send_invitation_to_existing_user(invitation_email_hash)
    UserMailer.invitation_to_existing_user(invitation_email_hash).deliver_now! if email.present?
  end

  def send_join_school_email(school)
    UserMailer.join_school_email(self, school).deliver_now! if email.present?
  end

  def send_lesson_plan_email(lessons, unit)
    UserMailer.lesson_plan_email(self, lessons, unit).deliver_now! if email.present?
  end

  def send_premium_user_subscription_email
    UserMailer.premium_user_subscription_email(self).deliver_now! if email.present?
  end

  def send_premium_school_subscription_email(school, admin)
    UserMailer.premium_school_subscription_email(self, school, admin).deliver_now! if email.present?
  end

  def send_new_admin_email(school)
    UserMailer.new_admin_email(self, school).deliver_now! if email.present?
  end

  def send_premium_school_missing_email
    UserMailer.premium_missing_school_email(self).deliver_now! if email.present?
  end

  def subscribe_to_newsletter
    if role == "teacher"
      SubscribeToNewsletterWorker.perform_async(id)
    end
  end

  def unsubscribe_from_newsletter
    if role == "teacher"
      UnsubscribeFromNewsletterWorker.perform_async(id)
    end
  end

  ransacker :created_at_date, type: :date do |parent|
    Arel::Nodes::SqlLiteral.new "date(items.created_at)"
  end

  # Connect to any classrooms already created by a teacher
  def connect_to_classrooms!
    classrooms = Classroom.where(clever_id: clever_user.sections.collect(&:id)).all
    classrooms.each { |c| c.students << self}
  end

  # Create the user from a Clever info hash
  def self.create_from_clever(hash, role_override = nil)
    user = User.where(email: hash[:info][:email]).first_or_initialize
    user = User.new if user.email.nil?
    user.update_attributes(
      clever_id: hash[:info][:id],
      token: (hash[:credentials] ? hash[:credentials][:token] : nil),
      role: role_override || hash[:info][:user_type],
      first_name: hash[:info][:name][:first],
      last_name: hash[:info][:name][:last]
    )
    user
  end

  # Create all classrooms this teacher is connected to
  def create_classrooms!
    clever_user.sections.each do |section|
      Classroom.setup_from_clever(section, self)
    end
  end

  def generate_student_username_if_absent
    return if !student?
    return if username.present?
    classroom_id = classrooms.any? ? classrooms.first.id : nil
    generate_username(classroom_id)
  end

  def newsletter?
    send_newsletter
  end

  def generate_teacher_account_info
    user_attributes = attributes
    user_attributes[:subscription] = subscription ? subscription.attributes : {}
    user_attributes[:subscription]['subscriptionType'] = premium_state
    if school && school.name
      user_attributes[:school] = school
      user_attributes[:school_type] = School::ALTERNATIVE_SCHOOLS_DISPLAY_NAME_MAP[school.name] || School::US_K12_SCHOOL_DISPLAY_NAME
    else
      user_attributes[:school] = School.find_by_name(School::NOT_LISTED_SCHOOL_NAME)
      user_attributes[:school_type] = School::US_K12_SCHOOL_DISPLAY_NAME
    end
    user_attributes
  end

  def delete_dashboard_caches
    delete_classroom_minis_cache
    delete_struggling_students_cache
    delete_difficult_concepts_cache
  end

  def delete_classroom_minis_cache
    $redis.del("user_id:#{id}_classroom_minis")
  end

  def delete_struggling_students_cache
    $redis.del("user_id:#{id}_struggling_students")
  end

  def delete_difficult_concepts_cache
    $redis.del("user_id:#{id}_difficult_concepts")
  end

  def coteacher_invitations
    Invitation.where(archived: false, invitation_type: 'coteacher', invitee_email: email)
  end

  def is_new_teacher_without_school?
    role == 'teacher' && !school && previous_changes["id"]
  end

  def generate_username(classroom_id=nil)
    self.username = GenerateUsername.new(
      first_name,
      last_name,
      get_class_code(classroom_id)
    ).call
  end

  private
  def validate_flags
    # ensures there are no items in the flags array that are not in the VALID_FLAGS const
    invalid_flags = flags - VALID_FLAGS
    if invalid_flags.any?
       errors.add(:flags, "invalid flag(s) #{invalid_flags}")
    end
  end

  def prep_authentication_terms
    self.email = email.downcase unless email.blank?
    self.username= username.downcase unless username.blank?
  end

  def check_for_school
    if school
      find_or_create_checkbox('Add School', self)
    end
  end

  # Clever integration
  def clever_user
    klass = "Clever::#{role.capitalize}".constantize
    @clever_user ||= klass.retrieve(clever_id, districts.first.token)
  end

  # validation filters
  def email_required_or_present?
    email_required? or email.present?
  end

  def email_required?
    return false if clever_id
    return false if role.temporary?
    return true if teacher?
    false
  end

  def clever_id_present_and_has_changed?
    return false if !clever_id
    return true if !id

    extant_user = User.find_by_id(id)
    extant_user.clever_id != clever_id
  end

  def requires_password?
    return false if clever_id
    return false if signed_up_with_google
    permanent? && new_record?
  end

  # FIXME: may not be being called anywhere
  def password?
    password.present?
  end

  def get_class_code(classroom_id)
    return 'student' if classroom_id.nil?
    Classroom.find(classroom_id).code
  end

  def update_invitee_email_address
    Invitation.where(invitee_email: email_was).update_all(invitee_email: email)
  end
end
