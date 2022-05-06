# frozen_string_literal: true

class GenerateConceptsInUseArrayWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::LOW

  REDIS_KEY_QUESTION_TYPES = {
    "SC_QUESTIONS" => "connect_sentence_combining",
    "FIB_QUESTIONS" => "connect_fill_in_blanks",
    "SF_QUESTIONS" => "connect_sentence_fragments",
    "D_QUESTIONS" => "diagnostic_sentence_combining",
    "D_FIB_QUESTIONS" => "diagnostic_fill_in_blanks",
    "D_SF_QUESTIONS" => "diagnostic_sentence_fragments",
  }.freeze

  CONCEPTS_IN_USE = [%w(
    name uid grades_proofreader_activities grades_grammar_activities grades_connect_activities
    grades_diagnostic_activities categorized_connect_questions categorized_diagnostic_questions
    part_of_diagnostic_recommendations last_retrieved
  )].to_json.freeze

  def perform
    set_concepts_in_use
    set_question_types
    run_individual_concept_workers
  end

  private def question_response(question_type)
    HTTParty
      .get("https://www.quill.org/api/v1/questions?question_type=#{question_type}")
      .parsed_response
      .to_json
  end

  private def run_individual_concept_workers
    Concept.visible_level_zero_concept_ids.each do |id|
      GetConceptsInUseIndividualConceptWorker.perform_async(id)
    end
  end

  private def set_concepts_in_use
    $redis.set("CONCEPTS_IN_USE", CONCEPTS_IN_USE)
    $redis.set("NUMBER_OF_CONCEPTS_IN_USE_LAST_SET", Time.current)
  end

  private def set_question_types
    REDIS_KEY_QUESTION_TYPES.each_pair do |redis_key, question_type|
      $redis.set(redis_key, question_response(question_type))
    end
  end
end
