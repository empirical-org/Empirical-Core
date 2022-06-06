# frozen_string_literal: true

class CopyConceptResultsToResponsesWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::LOW

  BATCH_SIZE=100000

  def perform(start, finish)
    directions_cache = {}
    instructions_cache = {}
    previous_feedbacks_cache = {}
    prompts_cache = {}
    question_types_cache = {}

    Response.bulk_insert(ignore: true) do |worker|
      ConceptResult.where(id: start..finish).each do |concept_result|

        directions = concept_result.metadata['directions']
        instructions = concept_result.metadata['instructions']
        previous_feedback = concept_result.metadata['lastFeedback']
        prompt = concept_result.metadata['prompt']
        question_type = concept_result.question_type

        directions_cache[directions] ||= ResponseDirections.find_or_create_by(text: directions)&.id if directions
        instructions_cache[instructions] ||= ResponseInstructions.find_or_create_by(text: instructions)&.id if instructions
        previous_feedbacks_cache[previous_feedback] ||= ResponsePreviousFeedback.find_or_create_by(text: previous_feedback)&.id if previous_feedback
        prompts_cache[prompt] ||= ResponsePrompt.find_or_create_by(text: prompt)&.id if prompt
        question_types_cache[question_type] ||= ResponseQuestionType.find_or_create_by(text: question_type)&.id if question_type

        extra_metadata = Response.parse_extra_metadata(concept_result.metadata)

        worker.add({
          answer: concept_result.metadata['answer'],
          attempt_number: concept_result.metadata['attemptNumber'],
          correct: concept_result.metadata['correct'] == 1,
          extra_metadata: extra_metadata,
          question_number: concept_result.metadata['questionNumber'],
          question_score: concept_result.metadata['questionScore'],
          activity_session_id: concept_result.activity_session_id,
          concept_result_id: concept_result.id,
          response_directions_id: directions_cache[directions],
          response_instructions_id: instructions_cache[instructions],
          response_previous_feedback_id: previous_feedbacks_cache[previous_feedback],
          response_prompt_id: prompts_cache[prompt],
          response_question_type_id: question_types_cache[question_type]
        })
      end
    end
  end
end
