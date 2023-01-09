# frozen_string_literal: true

FactoryBot.define do
  factory :evidence_prompt_health, class: 'Evidence::PromptHealth' do
    prompt_id { 1 }
    activity_short_name { "test activity" }
    text { "some prompt text here" }
    current_version { 1 }
    version_responses { 10 }
    first_attempt_optimal { 90 }
    avg_attempts { 3 }
  end
end
