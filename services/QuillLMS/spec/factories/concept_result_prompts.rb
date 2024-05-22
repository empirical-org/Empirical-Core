# frozen_string_literal: true

# == Schema Information
#
# Table name: concept_result_prompts
#
#  id         :integer          not null, primary key
#  text       :text             not null
#  created_at :datetime         not null
#
# Indexes
#
#  index_concept_result_prompts_on_text  (text) UNIQUE
#
FactoryBot.define do
  factory :concept_result_prompt do
    sequence(:text) { |n| "This a student response prompt #{n}." }
  end
end
