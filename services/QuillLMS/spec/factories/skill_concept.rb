# frozen_string_literal: true

FactoryBot.define do
  factory :skill_concept do
    skill { create(:skill) }
    concept { create(:concept) }
  end
end
