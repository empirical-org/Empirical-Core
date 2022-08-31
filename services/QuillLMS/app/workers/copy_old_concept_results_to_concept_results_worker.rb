# frozen_string_literal: true

class CopyOldConceptResultsToConceptResultsWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::MIGRATION

  class ConceptResultMigrationDeadlocked < StandardError; end

  BATCH_SIZE = 1_000

  def perform(start, finish, batch_inserts)
    return bulk_insert(start, finish) if batch_inserts

    enqueue_individual_inserts(start, finish)
  end

  def enqueue_individual_inserts(start, finish)
    (start..finish).each do |old_concept_result_id|
      CopySingleConceptResultWorker.perform_async(old_concept_result_id)
    end
  end

  # rubocop:disable Metrics/CyclomaticComplexity
  def bulk_insert(start, finish)
    directions_cache = {}
    instructions_cache = {}
    previous_feedbacks_cache = {}
    prompts_cache = {}
    question_types_cache = {}

    ConceptResult.bulk_insert(ignore: true) do |bulk_inserter|
      OldConceptResult.where(id: start..finish).find_each(batch_size: BATCH_SIZE) do |old_concept_result|

        directions = old_concept_result.metadata['directions']
        instructions = old_concept_result.metadata['instructions']
        previous_feedback = old_concept_result.metadata['lastFeedback']
        prompt = old_concept_result.metadata['prompt']
        question_type = old_concept_result.question_type

        directions_cache[directions] ||= ConceptResultDirections.find_or_create_by(text: directions)&.id if directions
        instructions_cache[instructions] ||= ConceptResultInstructions.find_or_create_by(text: instructions)&.id if instructions
        previous_feedbacks_cache[previous_feedback] ||= ConceptResultPreviousFeedback.find_or_create_by(text: previous_feedback)&.id if previous_feedback
        prompts_cache[prompt] ||= ConceptResultPrompt.find_or_create_by(text: prompt)&.id if prompt
        question_types_cache[question_type] ||= ConceptResultQuestionType.find_or_create_by(text: question_type)&.id if question_type

        extra_metadata = ConceptResult.parse_extra_metadata(old_concept_result.metadata)

        bulk_inserter.add({
          answer: old_concept_result.metadata['answer'],
          attempt_number: old_concept_result.metadata['attemptNumber'],
          concept_id: old_concept_result.concept_id,
          correct: old_concept_result.metadata['correct'] == 1,
          extra_metadata: extra_metadata,
          question_number: old_concept_result.metadata['questionNumber'],
          question_score: old_concept_result.metadata['questionScore'],
          activity_session_id: old_concept_result.activity_session_id,
          old_concept_result_id: old_concept_result.id,
          concept_result_directions_id: directions_cache[directions],
          concept_result_instructions_id: instructions_cache[instructions],
          concept_result_previous_feedback_id: previous_feedbacks_cache[previous_feedback],
          concept_result_prompt_id: prompts_cache[prompt],
          concept_result_question_type_id: question_types_cache[question_type]
        })
      end
    end
  rescue ActiveRecord::Deadlocked => e
    raise(ConceptResultMigrationDeadlocked.new, e.message)
  end
  # rubocop:enable Metrics/CyclomaticComplexity
end
