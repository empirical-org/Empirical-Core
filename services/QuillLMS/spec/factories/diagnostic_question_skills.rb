# frozen_string_literal: true

FactoryBot.define do
  factory :diagnostic_question_skill do
    sequence(:name) { |n| "Skill-#{n}" }
    skill_group { create(:skill_group) }
    question { create(:question) }
  end
end
