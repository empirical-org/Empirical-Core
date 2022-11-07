# frozen_string_literal: true

module Evidence
  class SpellingCheck
    API_TIMEOUT = 5
    ALL_CORRECT_FEEDBACK = '<p>Correct spelling!</p>'
    FALLBACK_INCORRECT_FEEDBACK = '<p>Update the spelling of the bolded word(s).</p>'
    FEEDBACK_TYPE = Rule::TYPE_SPELLING
    RESPONSE_TYPE = 'response'
    BING_API_URL = 'https://api.cognitive.microsoft.com/bing/v7.0/SpellCheck'
    SPELLING_CONCEPT_UID = 'H-2lrblngQAQ8_s-ctye4g'

    class BingRateLimitException < StandardError; end
    class BingTimeoutError < StandardError; end
    TIMEOUT_ERROR_MESSAGE = "request took longer than #{API_TIMEOUT} seconds"

    # TODO: replace with better exception code
    EXCEPTIONS = [
      'solartogether',
      'jerom',
      'espana',
      'españa',
      'cafebabel',
      'cafébabel',
      'then',
      'sanchez',
      'sánchez',
      'kanaka',
      'kānaka',
      'worldwatch',
      'wilmut',
      'quokkaselfie',
      'quokkaselfies'
    ]

    attr_reader :entry

    def initialize(entry)
      @entry = entry
    end

    # rubocop:disable Metrics/CyclomaticComplexity
    def feedback_object
      return {} if error.present?

      {
        feedback: optimal? ? ALL_CORRECT_FEEDBACK : non_optimal_feedback_string,
        feedback_type: FEEDBACK_TYPE,
        optimal: optimal?,
        entry: @entry,
        concept_uid: SPELLING_CONCEPT_UID,
        rule_uid: spelling_rule&.uid || '',
        hint: optimal? ? nil : spelling_rule&.hint,
        highlight: optimal? ? [] : highlight
      }
    end
    # rubocop:enable Metrics/CyclomaticComplexity

    def non_optimal_feedback_string
      spelling_rule&.feedbacks&.first&.text || FALLBACK_INCORRECT_FEEDBACK
    end

    def error
      bing_response['error'] ? bing_response['error']['message'] : nil
    end

    private def spelling_rule
      return @spelling_rule if @spelling_rule

      @spelling_rule ||= Rule.where(rule_type: FEEDBACK_TYPE).first
    end

    private def highlight
      misspelled.map {|m| { type: RESPONSE_TYPE, id: nil, text: m['token']}}
    end

    private def optimal?
      misspelled.empty?
    end

    private def misspelled
      bing_response['flaggedTokens']&.reject {|r| r['token']&.downcase&.in?(EXCEPTIONS)} || []
    end

    private def bing_response
      @response ||= HTTParty.get(BING_API_URL.to_s,
        headers: {
          "Ocp-Apim-Subscription-Key": ENV['OCP-APIM-SUBSCRIPTION-KEY']
        },
        query: {
          text: @entry,
          mode: "proof"
        },
        timeout: API_TIMEOUT
      )
      # The rest of this code basically swallows any errors, but we want
      # to avoid swallowing errors around rate limiting, so raise those here
      raise BingRateLimitException if @response.code == 429

      JSON.parse(@response.body)
    rescue *Evidence::HTTP_TIMEOUT_ERRORS
      raise BingTimeoutError, TIMEOUT_ERROR_MESSAGE
    end
  end
end
