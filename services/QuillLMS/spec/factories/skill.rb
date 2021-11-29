# frozen_string_literal: true

FactoryBot.define do
  factory :skill do
    sequence(:name) { |n| "Skill-#{n}" }
    skill_group { create(:skill_group) }
  end
end
