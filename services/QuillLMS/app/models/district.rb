# frozen_string_literal: true

# == Schema Information
#
# Table name: districts
#
#  id             :integer          not null, primary key
#  city           :string
#  grade_range    :string
#  name           :string           not null
#  phone          :string
#  state          :string
#  token          :string
#  total_schools  :integer
#  total_students :integer
#  zipcode        :string
#  created_at     :datetime
#  updated_at     :datetime
#  clever_id      :string
#  nces_id        :bigint
#
# Indexes
#
#  index_districts_on_nces_id  (nces_id) UNIQUE
#
class District < ApplicationRecord
  include Subscriber

  VITALLY_NOT_APPLICABLE = 'N/A'

  validates :name, presence: true
  validates_uniqueness_of :nces_id, allow_blank: true, message: "A district with this NCES ID already exists."

  has_many :schools
  has_many :district_admins, dependent: :destroy
  has_many :admins, through: :district_admins, source: :user
  has_many :district_subscriptions
  has_many :subscriptions, through: :district_subscriptions

  scope :by_name, ->(name) { where('name ILIKE ?', "%#{name}%") }
  scope :by_city, ->(city) { where('city ILIKE ?', "%#{city}%") }
  scope :by_state, ->(state) { where(state: state.upcase) }
  scope :by_zipcode, ->(zipcode) { where(zipcode: zipcode) }
  scope :by_nces_id, ->(nces_id) { where(nces_id: nces_id) }
  scope :by_premium_status, ->(premium_status) { joins(:subscriptions).where("subscriptions.account_type = ?", premium_status) }

  def attach_subscription(subscription)
    district_subscriptions.create(subscription: subscription)
  end

  def total_invoice
    schools.sum { |s| s&.subscription&.payment_amount || 0 } / 100.0
  end

  def vitally_data
    {
      externalId: id.to_s,
      name: name,
      traits: {
        name: name,
        nces_id: nces_id,
        clever_id: clever_id,
        city: city,
        state: state,
        zipcode: zipcode,
        phone: phone,
        total_students: total_students,
        total_schools: total_schools,
        **vitally_diagnostic_rollups,
        **vitally_subscription_rollups,
        **vitally_activities_and_students_rollups
      }
    }
  end

  def vitally_activities_and_students_rollups
    current_time = Time.current
    school_year_start = School.school_year_start(current_time)
    last_school_year_start = School.school_year_start(current_time - 1.year)
    active_students_this_year = active_students(school_year_start, current_time)
    active_students_last_year = active_students(last_school_year_start, school_year_start)
    active_students_all_time = active_students
    activities_completed_this_year = activities_completed(school_year_start, current_time)
    activities_completed_last_year = activities_completed(last_school_year_start, school_year_start)
    activities_completed_all_time = activities_completed

    {
      active_students_this_year: active_students_this_year,
      active_students_last_year: active_students_last_year,
      active_students_all_time: active_students_all_time,
      activities_completed_this_year: activities_completed_this_year,
      activities_completed_last_year: activities_completed_last_year,
      activites_completed_all_time: activities_completed_all_time,
      activities_completed_per_student_this_year: active_students_this_year > 0 ? ((activities_completed_this_year.to_f / active_students_this_year).round(2)) : 0,
      activites_completed_per_student_last_year: active_students_last_year > 0 ? ((activities_completed_last_year.to_f / active_students_last_year).round(2)) : 0,
      activities_completed_per_student_all_time: active_students_all_time > 0 ? ((activities_completed_all_time.to_f / active_students_all_time).round(2)) : 0,
      last_active_time: last_active_time,
    }
  end

  def vitally_diagnostic_rollups
    school_year_start = School.school_year_start(Time.current)

    diagnostics_assigned_this_year = diagnostics_assigned_between_count(school_year_start, school_year_start + 1.year)
    diagnostics_assigned_last_year = diagnostics_assigned_between_count(school_year_start - 1.year, school_year_start)
    diagnostics_completed_this_year = diagnostics_completed_between(school_year_start, school_year_start + 1.year)
    diagnostics_completed_last_year = diagnostics_completed_between(school_year_start - 1.year, school_year_start)
    percent_completed_this_year = diagnostics_assigned_this_year > 0 ? (1.0 * diagnostics_completed_this_year / diagnostics_assigned_this_year) : 0.0
    percent_completed_last_year = diagnostics_assigned_last_year > 0 ? (1.0 * diagnostics_completed_last_year / diagnostics_assigned_last_year) : 0.0

    {
      diagnostics_assigned_this_year: diagnostics_assigned_this_year,
      diagnostics_assigned_last_year: diagnostics_assigned_last_year,
      diagnostics_completed_this_year: diagnostics_completed_this_year,
      diagnostics_completed_last_year: diagnostics_completed_last_year,
      percent_diagnostics_completed_this_year: percent_completed_this_year,
      percent_diagnostics_completed_last_year: percent_completed_last_year
    }
  end

  def vitally_subscription_rollups
    {
      premium_start_date: premium_start_date,
      premium_expiry_date: premium_expiry_date,
      district_subscription: district_subscription,
      annual_revenue_current_contract: annual_revenue_current_contract,
      stripe_invoice_id_current_contract: stripe_invoice_id_current_contract,
      purchase_order_number_current_contract: purchase_order_number_current_contract
    }
  end

  def diagnostics_assigned_between_count(start, stop)
    schools.select("array_length(classroom_units.assigned_student_ids, 1) AS assigned_students")
      .joins(users: {
      classrooms_i_teach: {
        classroom_units: {
          unit_activities: {
           activity: :classification
          }
        }
      }
    }).where(classification: {key: ActivityClassification::DIAGNOSTIC_KEY})
      .where(classroom_units: {created_at: start..stop})
      .map(&:assigned_students).reject(&:blank?).sum
  end

  def diagnostics_completed_between(start, stop)
    schools.joins(users: {
      classrooms_i_teach: {
        classroom_units: {
          activity_sessions: {
            activity: :classification
          }
        }
      }
    }).where(classification: {key: ActivityClassification::DIAGNOSTIC_KEY})
      .where(activity_sessions: {completed_at: start..stop})
      .distinct
      .count
  end

  def premium?
    subscription&.present?
  end

  def active_students(start_date: nil, end_date: nil)

    # use raw SQL to bypass scope limits (visible: true) on classrooms
    active_students = ActivitySession.select(:user_id)
      .distinct
      .joins("JOIN classroom_units on classroom_units.id=activity_sessions.classroom_unit_id")
      .joins("JOIN classrooms ON classrooms.id=classroom_units.classroom_id")
      .joins("JOIN classrooms_teachers ON classrooms_teachers.classroom_id=classrooms.id")
      .joins("JOIN schools_users ON schools_users.user_id = classrooms_teachers.user_id")
      .joins("JOIN schools ON schools_users.school_id=schools.id")
      .joins("JOIN districts ON schools.district_id = districts.id")
      .where(state: 'finished').where('districts.id = ?', id)

    if start_date.present?
      active_students = active_students.where("activity_sessions.updated_at >= ?", start_date)
    end

    if end_date.present?
      active_students = active_students.where("activity_sessions.updated_at <= ?", end_date)
    end

    active_students
  end

  def activities_completed(start_date: nil, end_date: nil)

    # use raw SQL to bypass scope limits (visible: true) on classrooms
    activities_completed = ClassroomsTeacher.joins("JOIN users ON users.id=classrooms_teachers.user_id")
      .joins("JOIN schools_users ON schools_users.user_id=users.id")
      .joins("JOIN schools ON schools.id=schools_users.school_id")
      .joins("JOIN classrooms ON classrooms.id=classrooms_teachers.classroom_id")
      .joins("JOIN classroom_units ON classroom_units.classroom_id=classrooms.id")
      .joins("JOIN activity_sessions ON activity_sessions.classroom_unit_id=classroom_units.id")
      .joins("JOIN districts ON schools.district_id = districts.id")
      .where('districts.id = ?', id)
      .where('activity_sessions.state = ?', 'finished')

    if start_date.present?
      activities_completed = activities_completed.where("activity_sessions.updated_at >= ?", start_date)
    end

    if end_date.present?
      activities_completed = activities_completed.where("activity_sessions.updated_at <= ?", end_date)
    end

    activities_completed
  end

  def last_active_time
    User.joins("JOIN schools_users ON schools_users.user_id = users.id")
      .joins("JOIN districts ON schools.district_id = districts.id")
      .where('districts.id = ?', id)
      .order(:last_sign_in, :desc)
      .first.last_sign_in
  end

  private def latest_subscription
    subscriptions.not_expired.not_de_activated.order(expiration: :desc).first
  end

  private def premium_start_date
    subscription&.start_date || VITALLY_NOT_APPLICABLE
  end

  private def premium_expiry_date
    latest_subscription&.expiration || VITALLY_NOT_APPLICABLE
  end

  private def district_subscription
    subscription&.account_type || VITALLY_NOT_APPLICABLE
  end

  private def annual_revenue_current_contract
    subscription&.payment_amount || VITALLY_NOT_APPLICABLE
  end

  private def stripe_invoice_id_current_contract
    subscription&.stripe_invoice_id || VITALLY_NOT_APPLICABLE
  end

  private def purchase_order_number_current_contract
    subscription&.purchase_order_number || VITALLY_NOT_APPLICABLE
  end

end
