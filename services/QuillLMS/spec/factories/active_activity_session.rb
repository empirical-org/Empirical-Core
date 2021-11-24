# frozen_string_literal: true

FactoryBot.define do
  data = {
    foo: 'bar'
  }
  factory :active_activity_session do
    uid   {SecureRandom.uuid}
    data  data
  end
end
