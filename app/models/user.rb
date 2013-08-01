class Array
  def except obj
    ar = dup
    ar.delete obj
    ar
  end
end

class User < ActiveRecord::Base
  has_secure_password
  # If someone clicks 'Sign Up' on the home page,
  # They should be asked for their email and their class code
  # And entering those should prompt the user to choose a password
  validates :email, presence: true
  validates_uniqueness_of :email, case_sensitive: false, allow_nil: true
  # validates_format_of :password, with: /((?=.*\d)(?=.*[A-Z]).{8,})/, message: 'must contain at least 1 number and 1 capital letter and be at least 8 characters long', allow_nil: true, on: :standard, if: :password?
  has_many :comments

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

  has_many :teacher_chapters, through: :assignments, source: :chapters
  has_many :student_chapters, through: :student_assignments, source: :chapter

  has_many :scores
  has_one :teacher, -> { where role: 'teacher' }, foreign_key: 'classcode', class_name: 'User', primary_key: 'classcode'
  has_many :assignable_chapters, class_name: 'Chapter', through: :teacher, source: :chapters
  ROLES = %w(user student admin teacher)
  SAFE_ROLES = ROLES.except('admin')

  def safe_role_assigment role
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
        teacher.assignments.each do |assignment|
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

  def activate!
    # CALLED BY UsersController#activate_email after user clicks email link
    self.email_activation_token = nil
    save
  end
end
