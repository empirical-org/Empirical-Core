# frozen_string_literal: true

# == Schema Information
#
# Table name: concept_result_instructions
#
#  id         :integer          not null, primary key
#  text       :text             not null
#  created_at :datetime         not null
#
# Indexes
#
#  index_concept_result_instructions_on_text  (text) UNIQUE
#
FactoryBot.define do
  factory :concept_result_instructions do
    sequence(:text) { |n| "These are student response instructions #{n}." }
  end
end
