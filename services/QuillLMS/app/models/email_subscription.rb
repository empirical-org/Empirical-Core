# frozen_string_literal: true

# == Schema Information
#
# Table name: email_subscriptions
#
#  id           :bigint           not null, primary key
#  cancel_token :string           not null
#  frequency    :string           not null
#  params       :jsonb
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  user_id      :integer          not null
#
# Indexes
#
#  index_email_subscriptions_on_frequency  (frequency)
#
class EmailSubscription < ApplicationRecord
  FREQUENCIES = [
    WEEKLY = 'Weekly',
    MONTHLY = 'Monthly'
  ]

  scope :monthly, -> { where(frequency: MONTHLY) }
  scope :weekly, -> { where(frequency: WEEKLY) }

  belongs_to :user

  validates :frequency, presence: true, inclusion: { in: FREQUENCIES }
end
