# frozen_string_literal: true

# == Schema Information
#
# Table name: concept_results
#
#  id                                  :bigint           not null, primary key
#  answer                              :jsonb
#  attempt_number                      :integer
#  correct                             :boolean          not null
#  extra_metadata                      :jsonb
#  question_number                     :integer
#  question_score                      :float
#  created_at                          :datetime         not null
#  activity_session_id                 :integer          not null
#  concept_id                          :integer
#  concept_result_directions_id        :integer
#  concept_result_instructions_id      :integer
#  concept_result_previous_feedback_id :integer
#  concept_result_prompt_id            :integer
#  concept_result_question_type_id     :integer
#
# Indexes
#
#  index_concept_results_on_activity_session_id  (activity_session_id)
#
FactoryBot.define do
  factory :concept_result do
    activity_session
    answer { 'This is a response answer' }
    attempt_number { 1 }
    concept
    concept_result_directions
    concept_result_instructions
    concept_result_previous_feedback
    concept_result_prompt
    concept_result_question_type
    correct { true }
    question_number { 1 }
    extra_metadata { nil }
  end
end
