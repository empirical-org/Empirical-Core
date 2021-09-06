# == Schema Information
#
# Table name: schools
#
#  id                    :integer          not null, primary key
#  charter               :string
#  city                  :string
#  ethnic_group          :string
#  free_lunches          :integer
#  fte_classroom_teacher :integer
#  latitude              :decimal(9, 6)
#  leanm                 :string
#  longitude             :decimal(9, 6)
#  lower_grade           :integer
#  magnet                :string
#  mail_city             :string
#  mail_state            :string
#  mail_street           :string
#  mail_zipcode          :string
#  name                  :string
#  nces_status_code      :string
#  nces_type_code        :string
#  phone                 :string
#  ppin                  :string
#  school_level          :integer
#  state                 :string
#  street                :string
#  total_students        :integer
#  ulocal                :integer
#  upper_grade           :integer
#  zipcode               :string
#  created_at            :datetime
#  updated_at            :datetime
#  authorizer_id         :integer
#  clever_id             :string
#  coordinator_id        :integer
#  lea_id                :string
#  nces_id               :string
#
# Indexes
#
#  index_schools_on_mail_zipcode    (mail_zipcode)
#  index_schools_on_name            (name)
#  index_schools_on_nces_id         (nces_id)
#  index_schools_on_state           (state)
#  index_schools_on_zipcode         (zipcode)
#  unique_index_schools_on_nces_id  (nces_id) UNIQUE WHERE ((nces_id)::text <> ''::text)
#  unique_index_schools_on_ppin     (ppin) UNIQUE WHERE ((ppin)::text <> ''::text)
#
class School < ApplicationRecord
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
   subscriptions.where("expiration > ? AND start_date <= ?", Date.today, Date.today).order(expiration: :desc).limit(1).first
  end

  def present_and_future_subscriptions
    subscriptions.where("expiration > ? AND de_activated_date IS NULL", Date.today).order(expiration: :asc)
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

  def generate_leap_csv(activities_since = Date.parse("2010-01-01"), options = {})
    CSV.generate(options) do |csv_file|
      csv_file << %w(QuillID DistrictID StudentName StudentEmail TeacherName ClassroomName SchoolName Percentage Date ActivityName StandardName MinutesSpent)

      students.each do |student|
        student.activity_sessions.where("completed_at >= ?", activities_since).where.not(completed_at: nil).each do |activity_session|
          classroom = activity_session.classroom
          teacher = User.joins(:classrooms_teachers).where(classrooms_teachers: {role: ClassroomsTeacher::ROLE_TYPES[:owner], classroom_id: classroom.id}).first
          csv_file << generate_leap_csv_row(student, teacher, classroom, activity_session)
        end
      end
    end
  end

  def students
    User.joins(student_in_classroom: {teachers: :school}).where(schools: {id: id}).distinct
  end

  def self.school_year_start(time)
    time.month >= 8 ? time.beginning_of_year + 7.months : time.beginning_of_year - 5.months
  end

  private def generate_leap_csv_row(student, teacher, classroom, activity_session)
    [
      student.id,
      student.third_party_user_ids.where(source: ThirdPartyUserId::SOURCES::LEAP).first&.id,
      student.name,
      student.email,
      teacher.name,
      classroom.name,
      name,
      activity_session.percentage,
      activity_session.completed_at,
      activity_session.activity.name,
      activity_session.activity&.standard&.standard_category&.name,
      activity_session.minutes_to_complete
    ]
  end

  private def lower_grade_within_bounds
    errors.add(:lower_grade, 'must be between 0 and 12') unless (0..12).include?(lower_grade.to_i)
  end

  private def upper_grade_within_bounds
    errors.add(:upper_grade, 'must be between 0 and 12') unless (0..12).include?(upper_grade.to_i)
  end

  private def lower_grade_greater_than_upper_grade
    return true unless lower_grade && upper_grade
    errors.add(:lower_grade, 'must be less than or equal to upper grade') if lower_grade.to_i > upper_grade.to_i
  end
end
