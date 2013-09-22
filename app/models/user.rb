class Array
  def except obj
    ar = dup
    ar.delete obj
    ar
  end
end

class User < ActiveRecord::Base
  include Student, Teacher
  has_secure_password validations: false
  # If someone clicks 'Sign Up' on the home page,
  # They should be asked for their email and their class code
  # And entering those should prompt the user to choose a password
  with_options if: :permanent? do |o|
    o.validates :email, presence: true
    o.validates_uniqueness_of :email, case_sensitive: false, allow_nil: true
    o.validates_confirmation_of :password, if: lambda { |m| m.password.present? }
    o.validates_presence_of     :password, on: :create
    o.validates_presence_of     :password_confirmation, if: lambda { |m| m.password.present? }
    o.before_create { raise "Password digest missing on new record" if password_digest.blank? }
  end

  has_many :teacher_assignments, class_name: 'Assignment' do
    def for_chapter chapter
      where(chapter_id: chapter.id).first
    end
  end

  has_many :student_assignments, through: :scores, source: :assignment do
    def for_chapter chapter
      where(chapter_id: chapter.id).first
    end
  end

  has_many :teacher_chapters, through: :teacher_assignments, source: :chapter
  has_many :student_chapters, through: :student_assignments, source: :chapter

  has_many :assignable_chapters, class_name: 'Chapter', through: :teacher, source: :chapters
  ROLES = %w(temporary user student admin teacher)
  SAFE_ROLES = ROLES.except('admin').except('temporary')
  default_scope -> { where('role != ?', 'temporary') }

  def safe_role_assignment role
    self.role = if sanitized_role = SAFE_ROLES.find{|r| r == role.strip }
      sanitized_role
    else
      'user'
    end
  end

  def after_initialize!
    # GENERATE TEMP PASSWORD (as to generate a password_digest on construction)
    # self.password_confirmation = self.password = SecureRandom.hex

    # GENERATE EMAIL AUTH TOKEN and EXPIRATION DATE
    self.email_activation_token = SecureRandom.hex
    self.confirmable_set_at = Time.now

    if classcode.blank? && student?
      self.classcode = 'demo-class'
    end

    if save
      if student?
        teacher.teacher_assignments.each do |assignment|
          scores.create(assignment_id: assignment.id)
        end
      end

      # SEND WELCOME MAIL
      UserMailer.welcome_email(self).deliver!
    else
      false
    end
  end

  def role
    @role_inquirer ||= ActiveSupport::StringInquirer.new(self[:role])
  end

  def role= role
    remove_instance_variable :@role_inquirer if defined?(@role_inquirer)
    super
  end

  def password?
    password.present?
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

  def activate!
    # CALLED BY UsersController#activate_email after user clicks email link
    self.email_activation_token = nil
    save
  end
end
