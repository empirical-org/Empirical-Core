# frozen_string_literal: true

FactoryBot.define do
  factory :activity_topic do
    topic { Topic.last || create(:topic) }
    activity { Activity.last || create(:activity) }
  end
end
