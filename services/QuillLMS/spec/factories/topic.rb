# frozen_string_literal: true

FactoryBot.define do
  factory :topic do
    sequence(:name) { |i| "Topic #{i}" }
    level           { rand(4) }
    visible         true
    parent_id       nil

    after(:build) do |t|
      case t.level
      when 2
        t.parent_id = Topic.find_by_level(3)&.id || create(:topic, level: 3).id
      when 1
        t.parent_id = Topic.find_by_level(2)&.id || create(:topic, level: 2).id
      end
    end

    trait :with_change_log do
      after(:create) do |t|
        create(:change_log, changed_record: t)
      end
    end
  end

end
