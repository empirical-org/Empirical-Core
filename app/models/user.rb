class User < ActiveRecord::Base
  include Student, Teacher

  has_secure_password validations: false

  has_and_belongs_to_many :schools
  has_and_belongs_to_many :districts

  delegate :name, :mail_city, :mail_state, to: :school, allow_nil: true, prefix: :school

  validates :name,                  format:       {without: /\t/, message: 'cannot contain tabs'}

  validate :name_must_contain_first_and_last_name

  validates :password,              confirmation: { if: :requires_password_confirmation? },
                                    presence:     { if: :requires_password? }

  validates :email,                 uniqueness:   { allow_blank: true, if: :email_required? },
                                    presence:     { if: :email_required? }

  validates :username,              presence:     { if: ->(m) { m.email.blank? && m.permanent? } },
                                    uniqueness:   { allow_blank: true },
                                    format:       {without: /\s/, message: 'cannot contain spaces'}

  validates :terms_of_service,      acceptance:   { on: :create }

  ROLES      = %w(student teacher temporary user admin)
  SAFE_ROLES = %w(student teacher temporary)

  default_scope -> { where('users.role != ?', 'temporary') }

  scope :teacher, lambda { where(role: 'teacher') }
  scope :student, lambda { where(role: 'student') }

  attr_accessor :newsletter

  before_validation :prep_authentication_terms

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

  def self.for_concept_tag_progress_report(teacher, filters)
    with(filtered_correct_results: ConceptTagResult.correct_results_for_progress_report(teacher, filters))
      .select(<<-SELECT
        users.id,
        users.name,
        COUNT(filtered_correct_results.*) as total_result_count,
        SUM(CASE WHEN filtered_correct_results.is_correct = 1 THEN 1 ELSE 0 END) as correct_result_count,
        SUM(CASE WHEN filtered_correct_results.is_correct = 0 THEN 1 ELSE 0 END) as incorrect_result_count
      SELECT
      ).joins('JOIN filtered_correct_results ON users.id = filtered_correct_results.user_id')
      .group('users.id')
      .order('users.name asc')
  end

  # Helper method used as CTE in other queries. Do not attempt to use this by itself
  def self.best_per_topic_user
    <<-BEST
      select topic_id, user_id, AVG(percentage) as avg_score_in_topic
      from best_activity_sessions
      group by topic_id, user_id
    BEST
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

  def self.for_standards_report(teacher, filters)
    User.from_cte('best_activity_sessions', ActivitySession.for_standards_report(teacher, filters))
      .with(best_per_topic_user: best_per_topic_user)
      .select(<<-SQL
        users.id,
        users.name,
        #{sorting_name_sql},
        AVG(best_activity_sessions.percentage) as average_score,
        COUNT(DISTINCT(best_activity_sessions.topic_id)) as total_standard_count,
        COUNT(DISTINCT(best_activity_sessions.activity_id)) as total_activity_count,
        COALESCE(AVG(proficient_count.topic_count), 0)::integer as proficient_standard_count,
        COALESCE(AVG(near_proficient_count.topic_count), 0)::integer as near_proficient_standard_count,
        COALESCE(AVG(not_proficient_count.topic_count), 0)::integer as not_proficient_standard_count
      SQL
      ).joins('JOIN users ON users.id = best_activity_sessions.user_id')
      .joins(<<-JOINS
      LEFT JOIN (
          select COUNT(DISTINCT(topic_id)) as topic_count, user_id
           from best_per_topic_user
           where avg_score_in_topic > 0.75
           group by user_id
        ) as proficient_count ON proficient_count.user_id = users.id
      JOINS
      ).joins(<<-JOINS
      LEFT JOIN (
          select COUNT(DISTINCT(topic_id)) as topic_count, user_id
           from best_per_topic_user
           where avg_score_in_topic <= 0.75 AND avg_score_in_topic >= 0.50
           group by user_id
        ) as near_proficient_count ON near_proficient_count.user_id = users.id
      JOINS
      ).joins(<<-JOINS
      LEFT JOIN (
          select COUNT(DISTINCT(topic_id)) as topic_count, user_id
           from best_per_topic_user
           where avg_score_in_topic < 0.5
           group by user_id
        ) as not_proficient_count ON not_proficient_count.user_id = users.id
      JOINS
      )
      .group('users.id, sorting_name')
      .order('sorting_name asc')
  end

  # def authenticate
  def self.authenticate(params)
    user =  User.where("email = ? OR username = ?", params[:email].downcase, params[:email].downcase).first
    user.try(:authenticate, params[:password])
  end

  def self.setup_from_clever(auth_hash)
    user = User.create_from_clever(auth_hash[:info])

    District.create_from_clever(user.clever_district_id)

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
    user = User.where(email: hash[:email]).first_or_initialize
    user = User.new if user.email.nil?
    user.update_attributes(
      clever_id: hash[:id],
      token: hash[:token],
      role: role_override || hash[:user_type],
      first_name: hash[:name][:first],
      last_name: hash[:name][:last]
    )
    user
  end

  # Create all classrooms this teacher is connected to
  def create_classrooms!
    clever_user.sections.each do |section|
      Classroom.setup_from_clever(section)
    end
  end

private
  def prep_authentication_terms
    self.email = email.downcase unless email.blank?
    self.username= username.downcase unless username.blank?
  end

  # Clever integration
  def clever_user
    klass = "Clever::#{self.role.capitalize}".constantize
    @clever_user ||= klass.retrieve(self.clever_id)
  end

  # validation filters
  def email_required?
    return false if self.clever_id
    return false if role.temporary?
    return true if teacher?

    username.blank?
  end

  def requires_password?
    return false if self.clever_id
    permanent? && new_record?
  end

  def requires_password_confirmation?
    requires_password? && password.present?
  end

  # FIXME: may not be being called anywhere
  def password?
    password.present?
  end

  def generate_username
    part1 = "#{first_name}.#{last_name}"
    part1_pattern = "%#{part1}%"
    extant = User.where("username ILIKE ?", part1_pattern)
    if extant.any?
      final = "#{part1}#{extant.length + 1}@#{classcode}"
    else
      final = "#{part1}@#{classcode}"
    end
    self.username = final
  end

  def newsletter?
    newsletter.to_i == 1
  end

end
