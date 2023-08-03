# frozen_string_literal: true

FactoryBot.define do
  factory :skill_group do
    sequence(:name) { |n| "Skill Group #{n}" }
    sequence(:order_number) { |n| n }
  end
end
