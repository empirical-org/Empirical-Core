# frozen_string_literal: true

FactoryBot.define do
  factory :locker do
    user_id { create(:user).id }
    label { 'Test locker label'}
    preferences { { 'test locker section': [] } }
  end
end
