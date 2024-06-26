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

  scope :monthly, -> { where(frequency: MONTHLY) }
  scope :weekly, -> { where(frequency: WEEKLY) }

  belongs_to :user

  validates :frequency, presence: true, inclusion: { in: FREQUENCIES }
  validates :subscription_type, presence: true, inclusion: { in: SUBSCRIPTION_TYPES }
end
