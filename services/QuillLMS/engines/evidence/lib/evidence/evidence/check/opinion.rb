module Evidence
  class Check::Opinion < Check::Base

    attr_reader :api_response

    def run
      opinion_client = Opinion::Client.new(entry: entry, prompt_text: prompt.text)
      @api_response = Opinion::FeedbackAssembler.run(opinion_client.post)
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
