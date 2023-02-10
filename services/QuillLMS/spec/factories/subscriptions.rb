# frozen_string_literal: true

# == Schema Information
#
# Table name: subscriptions
#
#  id                     :integer          not null, primary key
#  account_type           :string
#  de_activated_date      :date
#  expiration             :date
#  payment_amount         :integer
#  payment_method         :string
#  purchaser_email        :string
#  recurring              :boolean          default(FALSE)
#  start_date             :date
#  created_at             :datetime
#  updated_at             :datetime
#  plan_id                :integer
#  purchaser_id           :integer
#  stripe_invoice_id      :string
#  stripe_subscription_id :string
#
# Indexes
#
#  index_subscriptions_on_de_activated_date  (de_activated_date)
#  index_subscriptions_on_purchaser_email    (purchaser_email)
#  index_subscriptions_on_purchaser_id       (purchaser_id)
#  index_subscriptions_on_recurring          (recurring)
#  index_subscriptions_on_start_date         (start_date)
#
FactoryBot.define do
  factory :subscription do
    expiration { 15.days.from_now.to_date }
    start_date { 15.days.ago.to_date }
    account_type { 'Teacher Trial' }
    purchaser_id { nil }
    payment_method { '' }
    stripe_invoice_id { nil }
    stripe_subscription_id { nil }
    plan { nil }

    trait(:recurring) { recurring true }
    trait(:non_recurring) { recurring false }
    trait(:stripe) do
      stripe_subscription_id { "sub_#{SecureRandom.hex}" }
      stripe_invoice_id { "in_#{SecureRandom.hex}" }
    end

    after(:create) do |subscription|
      subscription.update(account_type: subscription.plan.name) if subscription.plan.present?
    end
  end
end
