module Evidence
  class Check::Spelling < Check::Base

    attr_reader :api_response

    def run
      spelling_check = Evidence::SpellingCheck.new(entry)
      @error = spelling_check.error
      @api_response = spelling_check.feedback_object
    end

    def optimal?
      return true unless response

      response['optimal']
    end

    def response
      api_response
    end
  end
end
