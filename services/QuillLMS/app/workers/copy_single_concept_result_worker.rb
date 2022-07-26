# frozen_string_literal: true

class CopySingleConceptResultWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::MIGRATION

  # rubocop:disable Metrics/CyclomaticComplexity
  def perform(old_concept_result_id)
    old_concept_result = OldConceptResult.find_by(id: old_concept_result_id)
    return unless old_concept_result
    return if old_concept_result.concept_result.present?

    metadata = old_concept_result.metadata
    metadata = JSON.parse(metadata) if metadata.is_a? String

    directions = metadata['directions']
    instructions = metadata['instructions']
    previous_feedback = metadata['lastFeedback']
    prompt = metadata['prompt']
    question_type = old_concept_result.question_type

    ActiveRecord::Base.transaction do
      directions = ConceptResultDirections.find_or_create_by(text: directions)&.id if directions
      instructions = ConceptResultInstructions.find_or_create_by(text: instructions)&.id if instructions
      previous_feedbacks = ConceptResultPreviousFeedback.find_or_create_by(text: previous_feedback)&.id if previous_feedback
      prompts = ConceptResultPrompt.find_or_create_by(text: prompt)&.id if prompt
      question_types = ConceptResultQuestionType.find_or_create_by(text: question_type)&.id if question_type

      extra_metadata = ConceptResult.parse_extra_metadata(metadata)

      answer = metadata['answer']
      answer = answer.gsub(/\u0000/,'')

      ConceptResult.create!({
        answer: answer,
        attempt_number: metadata['attemptNumber'],
        concept_id: old_concept_result.concept_id,
        correct: metadata['correct'] == 1,
        extra_metadata: extra_metadata,
        question_number: metadata['questionNumber'],
        question_score: metadata['questionScore'],
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
