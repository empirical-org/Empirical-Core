class School < ActiveRecord::Base
  has_many :school_subscription
  has_many :subscriptions, through: :school_subscription
  has_many :schools_users,  class_name: 'SchoolsUsers'
  has_many :users, through: :schools_users
  has_many :schools_admins, class_name: 'SchoolsAdmins'
  has_many :admins, through: :schools_admins, source: :user
  belongs_to :authorizer, class_name: 'User'
  belongs_to :coordinator, class_name: 'User'

  validate :lower_grade_within_bounds, :upper_grade_within_bounds,
           :lower_grade_greater_than_upper_grade

  ALTERNATIVE_SCHOOL_NAMES = [
    HOME_SCHOOL_SCHOOL_NAME = 'home school',
    US_HIGHER_ED_SCHOOL_NAME = 'us higher ed',
    INTERNATIONAL_SCHOOL_NAME = 'international',
    NOT_LISTED_SCHOOL_NAME = 'not listed',
    OTHER_SCHOOL_NAME = 'other'
  ]

  US_K12_SCHOOL_DISPLAY_NAME = 'U.S. K-12 school'
  INTERNATIONAL_SCHOOL_DISPLAY_NAME = 'International institution'
  OTHER_SCHOOL_DISPLAY_NAME = 'Other'
  HOME_SCHOOL_SCHOOL_DISPLAY_NAME = 'Home school'
  US_HIGHER_ED_SCHOOL_DISPLAY_NAME = 'U.S. higher education institution'

  # have to stringify keys because rails will convert them to symbols otherwise
  ALTERNATIVE_SCHOOLS_DISPLAY_NAME_MAP = {
    HOME_SCHOOL_SCHOOL_NAME => HOME_SCHOOL_SCHOOL_DISPLAY_NAME,
    US_HIGHER_ED_SCHOOL_NAME => US_HIGHER_ED_SCHOOL_DISPLAY_NAME,
    OTHER_SCHOOL_NAME => OTHER_SCHOOL_DISPLAY_NAME,
    INTERNATIONAL_SCHOOL_NAME => INTERNATIONAL_SCHOOL_DISPLAY_NAME,
    NOT_LISTED_SCHOOL_NAME => US_K12_SCHOOL_DISPLAY_NAME
  }

  def subscription
   self.subscriptions.where("expiration > ? AND start_date <= ?", Date.today, Date.today).order(expiration: :desc).limit(1).first
  end

  def ulocal_to_school_type
    data = {
      "11": "City, Large",
      "12": "City, Mid-size",
      "13": "City, Small",
      "21": "Suburb, Large",
      "22": "Suburb, Mid-size",
      "23": "Suburb, Small",
      "31": "Town, Fringe",
      "32": "Town, Distant",
      "33": "Town, Remote",
      "41": "Rural, Fringe",
      "42": "Rural, Distant"
    }
    data[ulocal.to_s.to_sym]
  end

  def generate_leap_csv(activities_since = Time.parse("2010-01-01"), options = {})
    CSV.generate(options) do |csv_file|
      csv_file << %w(QuillID DistrictID StudentName StudentEmail TeacherName ClassroomName SchoolName Percentage Date ActivityName StandardName MinutesSpent)

      self.users.where(role: "teacher").each do |teacher|
        teacher.classrooms_teachers.where(role: "owner").each do |classrooms_teacher|
          classroom = classrooms_teacher.classroom
          classroom.students.each do |student|
            student.activity_sessions.where("completed_at >= ?", activities_since).each do |activity_session|
              csv_file << [
                student.id,
                student.third_party_user_ids.where(source: "LEAP").first,
                student.name,
                student.email,
                teacher.name,
                classroom.name,
                self.name,
                activity_session.percentage,
                activity_session.completed_at,
                activity_session.activity.name,
                activity_session.activity.topic.topic_category.name,
                ((activity_session.completed_at - activity_session.started_at)/60).round
              ]
            end
          end
        end
      end
    end
  end

  private def lower_grade_within_bounds
    errors.add(:lower_grade, 'must be between 0 and 12') unless (0..12).include?(self.lower_grade.to_i)
  end

  private def upper_grade_within_bounds
    errors.add(:upper_grade, 'must be between 0 and 12') unless (0..12).include?(self.upper_grade.to_i)
  end

  private def lower_grade_greater_than_upper_grade
    return true unless self.lower_grade && self.upper_grade
    errors.add(:lower_grade, 'must be less than or equal to upper grade') if self.lower_grade.to_i > self.upper_grade.to_i
  end
end
