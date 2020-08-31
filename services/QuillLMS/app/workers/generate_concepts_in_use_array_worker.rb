class GenerateConceptsInUseArrayWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::LOW

  def perform
    concepts_in_use = []
    headers = %w(name uid grades_proofreader_activities grades_grammar_activities grades_connect_activities grades_diagnostic_activities categorized_connect_questions categorized_diagnostic_questions part_of_diagnostic_recommendations last_retrieved)
    concepts_in_use << headers
    $redis.set("CONCEPTS_IN_USE", concepts_in_use.to_json)
    $redis.set("NUMBER_OF_CONCEPTS_IN_USE_LAST_SET", Time.now)
    sc_questions = HTTParty.get("https://quillconnect.firebaseio.com/v2/questions.json").parsed_response
    $redis.set('SC_QUESTIONS', sc_questions.to_json)
    fib_questions = HTTParty.get("https://quillconnect.firebaseio.com/v2/fillInBlankQuestions.json").parsed_response
    $redis.set('FIB_QUESTIONS', fib_questions.to_json)
    sf_questions = HTTParty.get("https://quillconnect.firebaseio.com/v2/sentenceFragments.json").parsed_response
    $redis.set('SF_QUESTIONS', sf_questions.to_json)
    d_questions = HTTParty.get("https://quillconnect.firebaseio.com/v2/diagnostic_questions.json").parsed_response
    $redis.set('D_QUESTIONS', d_questions.to_json)
    d_fib_questions = HTTParty.get("https://quillconnect.firebaseio.com/v2/diagnostic_fillInBlankQuestions.json").parsed_response
    $redis.set('D_FIB_QUESTIONS', d_fib_questions.to_json)
    d_sf_questions = HTTParty.get("https://quillconnect.firebaseio.com/v2/diagnostic_sentenceFragments.json").parsed_response
    $redis.set('D_SF_QUESTIONS', d_sf_questions.to_json)

    Concept.visible_level_zero_concept_ids.each do |id|
      GetConceptsInUseIndividualConceptWorker.perform_async(id)
    end
  end
end
