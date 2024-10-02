# frozen_string_literal: true

# == Schema Information
#
# Table name: comprehension_activities
#
#  id                 :integer          not null, primary key
#  ai_type            :string
#  notes              :string
#  scored_level       :string(100)
#  target_level       :integer
#  title              :string(100)
#  version            :integer          default(1), not null
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  parent_activity_id :integer
#
# Indexes
#
#  index_comprehension_activities_on_parent_activity_id  (parent_activity_id)

FactoryBot.define do
  factory :evidence_activity, class: 'Evidence::Activity' do
    sequence(:title) { |n| "MyString #{n}" }
    sequence(:notes) { |n| "MyString #{n}" }
    target_level { 1 }
    version { 1 }
    ai_type { Evidence::Activity::GENAI }

    trait :with_prompt_and_passage do
      after(:create) do |activity|
        create(:evidence_prompt, activity: activity)
        create(:evidence_passage, activity: activity)
      end
    end
  end
end
