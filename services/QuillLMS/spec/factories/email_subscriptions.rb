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
FactoryBot.define do
  factory :email_subscription do
    frequency { EmailSubscription::MONTHLY }
    subscription_type { EmailSubscription::ADMIN_DIAGNOSTIC_REPORT }
    user

    trait(:weekly) { frequency { EmailSubscription::WEEKLY } }
    trait(:monthly) { frequency { EmailSubscription::MONTHLY } }
  end
end

