module Comprehension
  class SpellingCheck

    ALL_CORRECT_FEEDBACK = 'Correct spelling!'
    INCORRECT_FEEDBACK = 'Try again. There may be a spelling mistake.'
    FEEDBACK_TYPE = 'spelling'
    RESPONSE_TYPE = 'response'
    BING_API_URL = 'https://api.cognitive.microsoft.com/bing/v7.0/SpellCheck'
    SPELLING_CONCEPT_UID = 'H-2lrblngQAQ8_s-ctye4g'
    attr_reader :entry

    def initialize(entry)
      @entry = entry
    end

    def feedback_object
      return render json: { error_message: bing_response['error']['message'] }, status: 400 if bing_response['error']
      feedback_obj = {
        feedback: ALL_CORRECT_FEEDBACK,
        feedback_type: FEEDBACK_TYPE,
        optimal: true,
        response_id: '',
        entry: @entry,
        concept_uid: SPELLING_CONCEPT_UID,
        rule_uid: '',
        highlight: []
      }

      misspelled = bing_response['flaggedTokens']
      if !misspelled.empty?
        feedback_obj.update(
          feedback: INCORRECT_FEEDBACK,
          optimal: false,
          highlight: misspelled.map {|m| { type: RESPONSE_TYPE, id: nil, text: m['token']}}
        )
      end

      feedback_obj
    end

    private def bing_response
      @response ||= HTTParty.get("#{BING_API_URL}",
        headers: {
          "Ocp-Apim-Subscription-Key": 'bcf0cf91e16b4454a583761d643908f1'
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
