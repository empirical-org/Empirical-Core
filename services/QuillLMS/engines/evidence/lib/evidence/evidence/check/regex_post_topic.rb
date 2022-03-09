module Evidence
  class Check::RegexPostTopic < Check::Base

    attr_reader :api_response

    def run
      regex_check = Evidence::RegexCheck.new(entry, prompt, Evidence::Rule::TYPE_REGEX_TWO)
      @api_response = regex_check.feedback_object
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
