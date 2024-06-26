# frozen_string_literal: true

FactoryBot.define do
  factory :email_subscription do
    frequency { EmailSubscription::MONTHLY }
    association :user

    trait(:weekly) { frequency { EmailSubscription::WEEKLY } }
    trait(:monthly) { frequency { EmailSubscription::MONTHLY }}
  end
end

