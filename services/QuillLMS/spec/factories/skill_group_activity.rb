# frozen_string_literal: true

FactoryBot.define do
  factory :skill_group_activity do
    skill_group { create(:skill_group) }
    activity { create(:activity) }
  end
end
