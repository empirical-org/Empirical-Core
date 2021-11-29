# frozen_string_literal: true

FactoryBot.define do
  factory :notification do
    text 'text'
    association :user, factory: :simple_user
  end
end
