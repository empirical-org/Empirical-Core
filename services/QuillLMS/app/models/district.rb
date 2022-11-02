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
        **vitally_diagnostic_rollups
      }
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
end
