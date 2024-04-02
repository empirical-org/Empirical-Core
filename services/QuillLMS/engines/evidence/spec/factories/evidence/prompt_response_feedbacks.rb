# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_prompt_response_feedbacks
#
#  id                 :bigint           not null, primary key
#  feedback           :text             not null
#  metadata           :jsonb
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  prompt_response_id :integer          not null
#

FactoryBot.define do
  factory :evidence_prompt_response_feedback, class: 'Evidence::PromptResponseFeedback' do
    feedback { Faker::Lorem.sentence }
    association :prompt_response, factory: :evidence_prompt_response
  end
end
