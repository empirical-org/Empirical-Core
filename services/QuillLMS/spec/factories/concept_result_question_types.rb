# frozen_string_literal: true

# == Schema Information
#
# Table name: concept_result_question_types
#
#  id         :integer          not null, primary key
#  text       :text             not null
#  created_at :datetime         not null
#
# Indexes
#
#  index_concept_result_question_types_on_text  (text) UNIQUE
#
FactoryBot.define do
  factory :concept_result_question_type do
    sequence(:text) { |n| "question-type-#{n}." }
  end
end
