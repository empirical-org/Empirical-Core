# frozen_string_literal: true

FactoryBot.define do
  factory :activity_topic do
    topic { create(:topic, level: 1) }
    activity { Activity.last || create(:activity) }
  end
end
