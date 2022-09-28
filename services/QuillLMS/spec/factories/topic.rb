# frozen_string_literal: true

FactoryBot.define do
  factory :topic do
    sequence(:name) { |i| "Topic #{i}" }
    level           { rand(1..3) }
    visible         true
    parent_id       nil

    after(:build) do |topic|
      topic.parent_id = Topic.find_or_create_by!(level: 3, name: 'level three').id if topic.level_two?
      if topic.level_one?
        level_three_topic = Topic.find_or_create_by!(level: 3, name: 'level three')
        topic.parent_id = Topic.find_or_create_by!(level: 2, name: 'level two', parent_id: level_three_topic.id).id
      end
    end

    trait :with_change_log do
      after(:create) do |t|
        create(:change_log, changed_record: t)
      end
    end
  end

end
