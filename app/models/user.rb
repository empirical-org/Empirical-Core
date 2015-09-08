class User < ActiveRecord::Base
  include Student, Teacher

  attr_accessor :validate_username,
                :require_password_confirmation_when_password_present

  before_save :capitalize_name
  before_save :generate_student_username_if_absent

  has_secure_password validations: false

  has_and_belongs_to_many :schools
  has_and_belongs_to_many :districts
  has_many :subscriptions

  delegate :name, :mail_city, :mail_state, to: :school, allow_nil: true, prefix: :school

  validates :name,                  presence: true,
                                    format:       {without: /\t/, message: 'cannot contain tabs'}

  validate :name_must_contain_first_and_last_name

  validates :password,              presence:     { if: :requires_password? }

  validates :email,                 presence:     { if: :email_required? },
                                    uniqueness:   { if: :email_required_or_present? }

  # gem validates_email_format_of
  validates_email_format_of :email, if: :email_required_or_present?

  validates :username,              presence:     { if: ->(m) { m.email.blank? && m.permanent? } },
                                    uniqueness:   { allow_blank: true },
                                    format:       {without: /\s/, message: 'cannot contain spaces', if: :validate_username?}


  ROLES      = %w(student teacher temporary user admin)
  SAFE_ROLES = %w(student teacher temporary)

  default_scope -> { where('users.role != ?', 'temporary') }

  scope :teacher, lambda { where(role: 'teacher') }
  scope :student, lambda { where(role: 'student') }

  attr_accessor :newsletter

  before_validation :prep_authentication_terms

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

  # one of the validations
  def name_must_contain_first_and_last_name
    return if name.nil?
    f,l = name.try(:split, /\s+/)
    if f.nil? or l.nil?
      errors.add :name, "must contain first and last name"
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

  def self.find_by_username_or_email(login_name)
    login_name.downcase!
    User.where("email = ? OR username = ?", login_name, login_name).first
  end

  def self.setup_from_clever(auth_hash)
    d = District.create_from_clever(auth_hash[:info][:district], auth_hash[:credentials][:token])

    user = User.create_from_clever(auth_hash)
    user.districts << d unless user.districts.include?(d)

    user.connect_to_classrooms! if user.student?
    user.create_classrooms! if user.teacher?

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

  def admin?
    role.admin?
  end

  def permanent?
    !role.temporary?
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

  def generate_student
    self.role = 'student'
    generate_username
    generate_password
  end

  def clever_district_id
    clever_user.district.id
  end

  def send_welcome_email
    UserMailer.welcome_email(self).deliver! if email.present?
  end

  def subscribe_to_newsletter
    ## FIXME this class should just get replaced with the mailchimp-api gem
    MailchimpConnection.subscribe_to_newsletter(email) if newsletter?
  end

  def imported_from_clever?
    self.token
  end

  def school
    self.schools.first
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
    generate_username
  end

private
  def prep_authentication_terms
    self.email = email.downcase unless email.blank?
    self.username= username.downcase unless username.blank?
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

  def generate_username
    self.username = UsernameGenerator.new(self).student
  end

  def newsletter?
    newsletter.to_i == 1
  end

end
