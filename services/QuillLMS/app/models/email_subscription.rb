# frozen_string_literal: true

# == Schema Information
#
# Table name: email_subscriptions
#
#  id                :bigint           not null, primary key
#  cancel_token      :string           not null
#  frequency         :string           not null
#  params            :jsonb
#  subscription_type :string           not null
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  user_id           :integer          not null
#
class EmailSubscription < ApplicationRecord
  FREQUENCIES = [
    WEEKLY = 'Weekly',
    MONTHLY = 'Monthly'
  ]

  SUBSCRIPTION_TYPES = [
    ADMIN_DIAGNOSTIC_REPORT = 'admin_diagnostic_report'
  ]

  FILTERS_TO_COPY = {
    ADMIN_DIAGNOSTIC_REPORT => [
      {
        from: AdminReportFilterSelection::DIAGNOSTIC_GROWTH_REPORT,
        to: AdminReportFilterSelection::DIAGNOSTIC_GROWTH_SUBSCRIPTION_SHARED
      },
      {
        from: AdminReportFilterSelection::DIAGNOSTIC_GROWTH_REPORT_OVERVIEW,
        to: AdminReportFilterSelection::DIAGNOSTIC_GROWTH_SUBSCRIPTION_OVERVIEW
      },
      {
        from: AdminReportFilterSelection::DIAGNOSTIC_GROWTH_REPORT_SKILL,
        to: AdminReportFilterSelection::DIAGNOSTIC_GROWTH_SUBSCRIPTION_SKILL
      },
      {
        from: AdminReportFilterSelection::DIAGNOSTIC_GROWTH_REPORT_STUDENT,
        to: AdminReportFilterSelection::DIAGNOSTIC_GROWTH_SUBSCRIPTION_STUDENT
      }
    ]
  }

  scope :monthly, -> { where(frequency: MONTHLY) }
  scope :weekly, -> { where(frequency: WEEKLY) }
  scope :premium, -> { joins(user: :school).merge(School.premium) }

  belongs_to :user

  validates :frequency, presence: true, inclusion: { in: FREQUENCIES }
  validates :subscription_type, presence: true, inclusion: { in: SUBSCRIPTION_TYPES }

  def copy_filters
    FILTERS_TO_COPY[subscription_type].each do |filter|
      copy_from = AdminReportFilterSelection.find_by(user:, report: filter[:from])
      next unless copy_from

      copy_to = AdminReportFilterSelection.find_by(user:, report: filter[:to]) || AdminReportFilterSelection.new(user:, report: filter[:to])
      copy_to.update(filter_selections: copy_from.filter_selections)
    end
  end
end
