# frozen_string_literal: true

class CopySingleConceptResultWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::MIGRATION

  # rubocop:disable Metrics/CyclomaticComplexity
  def perform(old_concept_result_id)
    old_concept_result = OldConceptResult.find(old_concept_result_id)

    directions = old_concept_result.metadata['directions']
    instructions = old_concept_result.metadata['instructions']
    previous_feedback = old_concept_result.metadata['lastFeedback']
    prompt = old_concept_result.metadata['prompt']
    question_type = old_concept_result.question_type

    ActiveRecord::Base.transaction do
      directions = ConceptResultDirections.find_or_create_by(text: directions)&.id if directions
      instructions ConceptResultInstructions.find_or_create_by(text: instructions)&.id if instructions
      previous_feedbacks = ConceptResultPreviousFeedback.find_or_create_by(text: previous_feedback)&.id if previous_feedback
      prompts = ConceptResultPrompt.find_or_create_by(text: prompt)&.id if prompt
      question_types = ConceptResultQuestionType.find_or_create_by(text: question_type)&.id if question_type

      extra_metadata = ConceptResult.parse_extra_metadata(old_concept_result.metadata)

      ConceptResult.create!({
        answer: old_concept_result.metadata['answer'],
        attempt_number: old_concept_result.metadata['attemptNumber'],
        concept_id: old_concept_result.concept_id,
        correct: old_concept_result.metadata['correct'] == 1,
        extra_metadata: extra_metadata,
        question_number: old_concept_result.metadata['questionNumber'],
        question_score: old_concept_result.metadata['questionScore'],
        activity_session_id: old_concept_result.activity_session_id,
        old_concept_result_id: old_concept_result.id,
        concept_result_directions_id: directions,
        concept_result_instructions_id: instructions,
        concept_result_previous_feedback_id: previous_feedbacks,
        concept_result_prompt_id: prompts,
        concept_result_question_type_id: question_types
      })
    end
  end
  # rubocop:enable Metrics/CyclomaticComplexity
end
