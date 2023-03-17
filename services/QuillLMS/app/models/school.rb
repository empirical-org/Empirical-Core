# frozen_string_literal: true

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
#  district_id           :bigint
#  nces_id               :string
#
# Indexes
#
#  index_schools_on_district_id     (district_id)
#  index_schools_on_mail_zipcode    (mail_zipcode)
#  index_schools_on_name            (name)
#  index_schools_on_nces_id         (nces_id)
#  index_schools_on_state           (state)
#  index_schools_on_zipcode         (zipcode)
#  unique_index_schools_on_nces_id  (nces_id) UNIQUE WHERE ((nces_id)::text <> ''::text)
#  unique_index_schools_on_ppin     (ppin) UNIQUE WHERE ((ppin)::text <> ''::text)
#
class School < ApplicationRecord
  include Subscriber

  has_many :school_subscriptions
  has_many :subscriptions, through: :school_subscriptions
  has_many :schools_users,  class_name: 'SchoolsUsers'
  has_many :users, through: :schools_users
  has_many :schools_admins, class_name: 'SchoolsAdmins'
  has_many :admins, through: :schools_admins, source: :user
  belongs_to :authorizer, class_name: 'User'
  belongs_to :coordinator, class_name: 'User'
  belongs_to :district

  before_save :detach_old_district_school_admins, if: :will_save_change_to_district_id?
  after_save :attach_new_district_school_admins, if: :saved_change_to_district_id?

  validate :lower_grade_within_bounds, :upper_grade_within_bounds,
           :lower_grade_greater_than_upper_grade
  validates :zipcode, length: { minimum: 5 }, allow_blank: true

  ALTERNATIVE_SCHOOL_NAMES = [
    HOME_SCHOOL_SCHOOL_NAME = 'home school',
    US_HIGHER_ED_SCHOOL_NAME = 'us higher ed',
    INTERNATIONAL_SCHOOL_NAME = 'international',
    NOT_LISTED_SCHOOL_NAME = 'not listed',
    NO_SCHOOL_SELECTED_SCHOOL_NAME = 'no school selected',
    OTHER_SCHOOL_NAME = 'other'
  ]

  US_K12_SCHOOL_DISPLAY_NAME = 'U.S. K-12 school'
  INTERNATIONAL_SCHOOL_DISPLAY_NAME = 'International institution'
  OTHER_SCHOOL_DISPLAY_NAME = 'Other'
  HOME_SCHOOL_SCHOOL_DISPLAY_NAME = 'Home school'
  US_HIGHER_ED_SCHOOL_DISPLAY_NAME = 'U.S. higher education institution'
  NO_SCHOOL_SELECTED_DISPLAY_NAME = 'No school selected'

  # have to stringify keys because rails will convert them to symbols otherwise
  ALTERNATIVE_SCHOOLS_DISPLAY_NAME_MAP = {
    HOME_SCHOOL_SCHOOL_NAME => HOME_SCHOOL_SCHOOL_DISPLAY_NAME,
    US_HIGHER_ED_SCHOOL_NAME => US_HIGHER_ED_SCHOOL_DISPLAY_NAME,
    OTHER_SCHOOL_NAME => OTHER_SCHOOL_DISPLAY_NAME,
    INTERNATIONAL_SCHOOL_NAME => INTERNATIONAL_SCHOOL_DISPLAY_NAME,
    NOT_LISTED_SCHOOL_NAME => US_K12_SCHOOL_DISPLAY_NAME,
    NO_SCHOOL_SELECTED_SCHOOL_NAME => US_K12_SCHOOL_DISPLAY_NAME
  }

  SCHOOL_YEAR_START_MONTH = 7
  HALF_A_YEAR = 6.months
  ELEMENTARY = 'elementary'
  MIDDLE = 'middle'
  HIGH = 'high'

  GRADE_DESCRIPTIONS = {
    1 => ELEMENTARY,
    2 => ELEMENTARY,
    3 => ELEMENTARY,
    4 => ELEMENTARY,
    5 => ELEMENTARY,
    6 => MIDDLE,
    7 => MIDDLE,
    8 => MIDDLE,
    9 => HIGH,
    10 => HIGH,
    11 => HIGH,
    12 => HIGH,
  }

  def self.school_year_start(time)
    time.month >= SCHOOL_YEAR_START_MONTH ? time.beginning_of_year + HALF_A_YEAR : time.beginning_of_year - HALF_A_YEAR
  end

  def attach_subscription(subscription)
    school_subscriptions.create(subscription: subscription)
  end

  def alternative?
    ALTERNATIVE_SCHOOL_NAMES.include?(name)
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

  def detach_from_existing_district_admins(district)
    return unless district.present? && district.admins.count > 0

    schools_admins.where(user_id: district.admins.map(&:id)).destroy_all
  end

  def vitally_data
    {
      externalId: id.to_s,
      name: name
    }
  end

  def subscription_status
    subscription&.subscription_status || last_expired_subscription&.subscription_status
  end

  def district_name
    district&.name
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

  private def attach_new_district_school_admins
    return if district_id.nil?

    new_district = District.find(district_id)
    new_admins = new_district.admins - admins
    schools_admins.create!(new_admins.map { |admin| { user: admin } })
  end

  private def detach_old_district_school_admins
    return if district_id_was.nil?

    old_district_admins = District.find(district_id_was).admins

    schools_admins
      .where(user: old_district_admins)
      .destroy_all
  end

  private def zipcode_length
    return true unless zipcode && zipcode.length != 5

    errors.add(:zipcode, 'must be 5 digits')
  end
end
