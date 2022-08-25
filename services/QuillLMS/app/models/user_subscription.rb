# frozen_string_literal: true

# == Schema Information
#
# Table name: user_subscriptions
#
#  id              :integer          not null, primary key
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  subscription_id :integer
#  user_id         :integer
#
# Indexes
#
#  index_user_subscriptions_on_subscription_id  (subscription_id)
#  index_user_subscriptions_on_user_id          (user_id)
#
class UserSubscription < ApplicationRecord
  validates :user_id, :subscription_id, presence: true
  belongs_to :user
  belongs_to :subscription
  after_create :send_analytics

  def self.create_user_sub_from_school_sub(user, subscription)
    redeem_present_and_future_subscriptions_for_credit(user)
    create(user: user, subscription: subscription)
  end

  def self.create_user_sub_from_school_sub_if_they_do_not_have_that_school_sub(user, subscription)
    return if UserSubscription.where(user: user, subscription: subscription).exists?

    create_user_sub_from_school_sub(user, subscription)
  end

  def self.redeem_present_and_future_subscriptions_for_credit(user)
    user.present_and_future_subscriptions.each { |subscription| subscription.credit_user_and_de_activate }
  end

  def send_analytics
    PremiumAnalyticsWorker.perform_async(user_id, subscription&.account_type)
  end
end
