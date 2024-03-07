# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_prompt_responses
#
#  id            :bigint           not null, primary key
#  embedding     :vector(1536)     not null
#  response_text :text             not null
#  prompt_id     :integer          not null
#

FactoryBot.define do
  factory :evidence_prompt_response, class: 'Evidence::PromptResponse' do
    text { Faker::Lorem.sentence }
    embedding { Array.new(Evidence::PromptResponse::DIMENSION) { rand(-1.0..1.0) } }

    association :prompt, factory: :evidence_prompt
  end
end
