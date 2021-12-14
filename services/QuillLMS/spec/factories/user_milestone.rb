# frozen_string_literal: true

FactoryBot.define do
  factory :user_milestone do
    user { create(:user) }
    milestone { create(:milestone) }
  end
end