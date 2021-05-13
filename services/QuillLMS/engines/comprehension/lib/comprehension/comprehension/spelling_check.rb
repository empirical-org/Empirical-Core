module Comprehension
  class SpellingCheck

    ALL_CORRECT_FEEDBACK = 'Correct spelling!'
    FALLBACK_INCORRECT_FEEDBACK = 'Update the spelling of the bolded word.'
    FEEDBACK_TYPE = Rule::TYPE_SPELLING
    RESPONSE_TYPE = 'response'
    BING_API_URL = 'https://api.cognitive.microsoft.com/bing/v7.0/SpellCheck'
    SPELLING_CONCEPT_UID = 'H-2lrblngQAQ8_s-ctye4g'
    attr_reader :entry

    def initialize(entry)
      @entry = entry
    end

    def feedback_object
      return {} if error.present?
      {
        feedback: optimal? ? ALL_CORRECT_FEEDBACK : non_optimal_feedback_string,
        feedback_type: FEEDBACK_TYPE,
        optimal: optimal?,
        response_id: '',
        entry: @entry,
        concept_uid: SPELLING_CONCEPT_UID,
        rule_uid: spelling_rule&.uid || '',
        highlight: optimal? ? [] : highlight
      }
    end

    def non_optimal_feedback_string
      spelling_rule&.feedbacks&.first&.text || FALLBACK_INCORRECT_FEEDBACK
    end

    def error
      bing_response['error'] ? bing_response['error']['message'] : nil
    end

    private def spelling_rule
      return @spelling_rule if @spelling_rule
      @spelling_rule = Rule.where(rule_type: FEEDBACK_TYPE).first
    end

    private def highlight
      misspelled.map {|m| { type: RESPONSE_TYPE, id: nil, text: m['token']}}
    end

    private def optimal?
      misspelled.empty?
    end

    private def misspelled
      bing_response['flaggedTokens']
    end

    private def bing_response
      @response ||= HTTParty.get(BING_API_URL.to_s,
        headers: {
          "Ocp-Apim-Subscription-Key": ENV['OCP-APIM-SUBSCRIPTION-KEY']
        },
        query: {
          text: @entry,
          mode: "proof"
        }
      )
      JSON.parse(@response.body)
    end
  end
end
