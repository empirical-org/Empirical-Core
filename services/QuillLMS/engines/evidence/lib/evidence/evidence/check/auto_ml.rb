module Evidence
  class Check::AutoML < Check::Base

    attr_reader :api_response

    def run
      automl_check = Evidence::AutomlCheck.new(entry, prompt, previous_feedback)
      @api_response = automl_check.feedback_object
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
