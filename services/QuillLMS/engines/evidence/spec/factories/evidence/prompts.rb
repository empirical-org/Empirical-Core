# frozen_string_literal: true

# == Schema Information
#
# Table name: comprehension_prompts
#
#  id                    :integer          not null, primary key
#  activity_id           :integer
#  max_attempts          :integer
#  conjunction           :string(20)
#  text                  :string
#  max_attempts_feedback :text
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#  first_strong_example  :string           default("")
#  second_strong_example :string           default("")
#
FactoryBot.define do
  factory :evidence_prompt, class: 'Evidence::Prompt' do
    association :activity, factory: :evidence_activity
    conjunction { "because" }
    text { "my text would go here." }
    max_attempts_feedback { "MyText" }
  end
end
