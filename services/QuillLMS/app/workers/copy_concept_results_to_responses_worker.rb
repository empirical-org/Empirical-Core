# frozen_string_literal: true

class CopyConceptResultsToResponsesWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::LOW

  BATCH_SIZE=100000

  def check_cache(cache_hash, cache_value, klass, column)
    return unless cache_value

    cache_hash[cache_value] ||= klass.find_or_initialize_by(**{column => cache_value})
    cache_hash[cache_value].save(validate: false) if cache_hash[cache_value].new_record?
    cache_hash[cache_value].id
  end

  def perform(start, finish)
    answers_cache = {}
    directions_cache = {}
    instructions_cache = {}
    previous_feedbacks_cache = {}
    prompts_cache = {}
    question_types_cache = {}

    Response.bulk_insert(ignore: true) do |worker|
      ConceptResult.where(id: start..finish).each do |concept_result|

        answer = concept_result.metadata['answer']
        directions = concept_result.metadata['directions']
        instructions = concept_result.metadata['instructions']
        previous_feedback = concept_result.metadata['lastFeedback']
        prompt = concept_result.metadata['prompt']
        question_type = concept_result.question_type

        extra_metadata = Response.parse_extra_metadata(concept_result.metadata)

        worker.add({
          attempt_number: concept_result.metadata['attemptNumber'],
          correct: concept_result.metadata['correct'] == 1,
          extra_metadata: extra_metadata,
          question_number: concept_result.metadata['questionNumber'],
          question_score: concept_result.metadata['questionScore'],
          activity_session_id: concept_result.activity_session_id,
          concept_result_id: concept_result.id,
          response_answer_id: check_cache(answers_cache, answer, ResponseAnswer, :json),
          response_diections_id: check_cache(directions_cache, directions, ResponseDirections, :text),
          response_instructions_id: check_cache(instructions_cache, instructions, ResponseInstructions, :text),
          response_previous_feedback_id: check_cache(previous_feedbacks_cache, previous_feedback, ResponsePreviousFeedback, :text),
          response_prompt_id: check_cache(prompts_cache, prompt, ResponsePrompt, :text),
          response_question_type_id: check_cache(question_types_cache, question_type, ResponseQuestionType, :text)
        })
      end
    end
  end
end
