# frozen_string_literal: true

# == Schema Information
#
# Table name: comprehension_activities
#
#  id                 :integer          not null, primary key
#  title              :string(100)
#  parent_activity_id :integer
#  target_level       :integer
#  scored_level       :string(100)
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  notes              :string
#  version            :integer          default(1), not null
#
FactoryBot.define do
  factory :evidence_activity do
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
