class User < ActiveRecord::Base
  include Student, Teacher, CheckboxCallback

  attr_accessor :validate_username,
                :require_password_confirmation_when_password_present

  before_save :capitalize_name
  before_save :generate_student_username_if_absent


  has_secure_password validations: false

  has_many :admin_accounts_teachers,
            class_name: "AdminAccountsTeachers",
            foreign_key: :teacher_id,
            dependent: :destroy

  has_many :admin_accounts_admins,
            class_name: "AdminAccountsAdmins",
            foreign_key: :admin_id,
            dependent: :destroy

  has_many :admin_accounts_im_in, through: :admin_accounts_teachers, source: :admin_account, inverse_of: :teachers

  has_many :admin_accounts, through: :admin_accounts_admins, source: :admin_account, inverse_of: :admins

  has_many :teachers, through: :admin_accounts, source: :teachers, inverse_of: :my_admins

  has_many :my_admins, through: :admin_accounts_im_in, source: :admins, inverse_of: :teachers

  has_many :checkboxes
  has_many :objectives, through: :checkboxes
  has_one :schools_users
  has_one :school, through: :schools_users

  has_many :schools_admins, class_name: 'SchoolsAdmins'
  has_many :admin_rights, through: :schools_admins, source: :school, foreign_key: :user_id


  has_and_belongs_to_many :districts
  has_one :ip_location
  has_many :user_milestones
  has_many :milestones, through: :user_milestones



  delegate :name, :mail_city, :mail_state, to: :school, allow_nil: true, prefix: :school


  validates :name,                  presence: true,
                                    format:       {without: /\t/, message: 'cannot contain tabs'}

  validates_with FullnameValidator

  validates :password,              presence:     { if: :requires_password? }

  validates :email,                 presence:     { if: :email_required? },
                                    uniqueness:   { if: :email_required_or_present? },
                                    on: :create

  validate  :validate_username_and_email,  on: :update

  # gem validates_email_format_of
  validates_email_format_of :email, if: :email_required_or_present?

  validates :username,              presence:     { if: ->(m) { m.email.blank? && m.permanent? } },
                                    uniqueness:   { allow_blank: true },
                                    format:       {without: /\s/, message: 'cannot contain spaces', if: :validate_username?},
                                    on: :create

  validates :flag,                  inclusion: { in: %w(alpha beta production),
                                    message: "%{value} is not a valid flag" }, :allow_nil => true


  ROLES      = %w(student teacher temporary user admin staff)
  SAFE_ROLES = %w(student teacher temporary)

  default_scope -> { where('users.role != ?', 'temporary') }

  scope :teacher, lambda { where(role: 'teacher') }
  scope :student, lambda { where(role: 'student') }

  attr_accessor :newsletter

  before_validation :prep_authentication_terms

  after_save :check_for_school

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

  def safe_role_assignment role
    self.role = if sanitized_role = SAFE_ROLES.find{ |r| r == role.strip }
      sanitized_role
    else
      'user'
    end
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
      f,l = name.split(/\s+/)
      if f.present? and l.present?
        result = "#{f.capitalize} #{l.capitalize}"
      else
        result = name.capitalize
      end
    end
    self.name = result
  end

  def admin?
    SchoolsAdmins.find_by_user_id(self.id).present?
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

  def admins_teachers
    schools = self.admin_rights.includes(:users)
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
    self.update!(name: "Deleted User_#{self.id}", email: "deleted_user_#{self.id}@example.com", username: "deleted_user_#{self.id}")
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
    self.password = self.password_confirmation = last_name
  end

  def generate_student(classroom_id)
    self.role = 'student'
    generate_username(classroom_id)
    generate_password
  end

  def clever_district_id
    clever_user.district.id
  end

  def send_welcome_email
    UserMailer.welcome_email(self).deliver_now! if email.present?
  end

  def send_account_created_email(temp_password, admin_name)
    UserMailer.account_created_email(self, temp_password, admin_name).deliver_now! if email.present?
  end

  def send_join_school_email(school)
    UserMailer.join_school_email(self, school).deliver_now! if email.present?
  end

  def subscribe_to_newsletter
    if self.role == "teacher"
      SubscribeToNewsletterWorker.perform_async(self.id)
    end
  end

  def imported_from_clever?
    self.token
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
    return if not student?
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
    user_attributes[:school] = school
    user_attributes
  end

  def delete_classroom_minis_cache
    $redis.del("user_id:#{self.id}_classroom_minis")
  end

private
  def validate_username_and_email
    # change_field will return the field (username or email) that is changing
    change_field = detect_username_or_email_updated
    if change_field && User.find_by(change_field => self[change_field])
      # if the field has been changed, to that of an existing record,
      # raise an error
      errors.add(change_field, "is being updated to a #{change_field} that exists")
    end
  end

  def detect_username_or_email_updated
    @db_self = User.find(self.id)
    if @db_self.username != self.username
      return :username
    elsif @db_self.email != self.email
      return :email
    else
      nil
    end
  end

  def prep_authentication_terms
    self.email = email.downcase unless email.blank?
    self.username= username.downcase unless username.blank?
  end

  def check_for_school
    if self.school
      find_or_create_checkbox('Add School', self)
    end
  end

  # Clever integration
  def clever_user
    klass = "Clever::#{self.role.capitalize}".constantize
    @clever_user ||= klass.retrieve(self.clever_id, self.districts.first.token)
  end

  # validation filters
  def email_required_or_present?
    email_required? or email.present?
  end

  def email_required?
    return false if self.clever_id
    return false if role.temporary?
    return true if teacher?
    false
  end

  def requires_password?
    return false if self.clever_id
    return false if self.signed_up_with_google
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

  def generate_username(classroom_id=nil)
    self.username = UsernameGenerator.run(self.first_name, self.last_name, get_class_code(classroom_id))
  end
end
