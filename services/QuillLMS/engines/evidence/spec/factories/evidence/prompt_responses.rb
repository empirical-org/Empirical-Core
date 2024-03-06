# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_prompt_responses
#
#  id        :integer          not null, primary key
#  embedding :vector(1536)     not null
#  text      :text             not null
#
# Indexes
#
#  index_evidence_prompt_responses_on_text  (text) UNIQUE
#

FactoryBot.define do
  factory :evidence_prompt_response, class: 'Evidence::PromptResponse' do
    text { Faker::Lorem.sentence }
    embedding { Array.new(Evidence::PromptResponse::DIMENSION) { rand(-1.0..1.0) } }
  end
end
