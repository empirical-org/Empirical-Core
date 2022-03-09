module Evidence
  class Check::Prefilter < Check::Base

    attr_reader :api_response

    def run
      prefilter_check = Evidence::PrefilterCheck.new(entry)
      @api_response = prefilter_check.feedback_object.stringify_keys
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
