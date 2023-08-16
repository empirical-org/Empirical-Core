# frozen_string_literal: true

FactoryBot.define do
  factory :active_activity_session do
    uid { SecureRandom.uuid }
    data { { foo: 'bar'} }
  end
end
