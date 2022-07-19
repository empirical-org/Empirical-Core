# frozen_string_literal: true

FactoryBot.define do
  factory :evidence_activity, class: 'Evidence::Activity' do
    sequence(:title) {|n| "MyString #{n}" }
    sequence(:notes) {|n| "MyString #{n}" }
    target_level { 1 }
    version { 1 }

    trait :with_prompt_and_passage do
      after(:create) do |activity|
        create(:evidence_prompt, activity: activity)
        create(:evidence_passage, activity: activity)
      end
    end
  end
end
