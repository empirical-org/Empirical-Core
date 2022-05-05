# frozen_string_literal: true

# == Schema Information
#
# Table name: subscriptions
#
#  id                :integer          not null, primary key
#  account_type      :string
#  de_activated_date :date
#  expiration        :date
#  payment_amount    :integer
#  payment_method    :string
#  purchaser_email   :string
#  recurring         :boolean          default(FALSE)
#  start_date        :date
#  created_at        :datetime
#  updated_at        :datetime
#  plan_id           :integer
#  purchaser_id      :integer
#  stripe_invoice_id :string
#
# Indexes
#
#  index_subscriptions_on_de_activated_date  (de_activated_date)
#  index_subscriptions_on_purchaser_email    (purchaser_email)
#  index_subscriptions_on_purchaser_id       (purchaser_id)
#  index_subscriptions_on_recurring          (recurring)
#  index_subscriptions_on_start_date         (start_date)
#  index_subscriptions_on_stripe_invoice_id  (stripe_invoice_id) UNIQUE
#
FactoryBot.define do
  factory :subscription do
    expiration { (Date.current + 15) }
    start_date { (Date.current - 15) }
    account_type { 'Teacher Trial' }
    purchaser_id { nil }
    payment_method { '' }
    stripe_invoice_id { nil }

    trait(:recurring) { recurring true }
    trait(:non_recurring) { recurring false }
    trait(:stripe) { stripe_invoice_id { "in_#{SecureRandom.hex}"} }
  end
end
