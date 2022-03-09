module Evidence
  class Check::Grammar < Check::Base

    attr_reader :api_response

    def run
      grammar_client = Grammar::Client.new(entry: entry, prompt_text: prompt.text)
      @api_response = Grammar::FeedbackAssembler.run(grammar_client.post)
    end

    def optimal?
      return true unless response

      response['optimal']
    end

    def response
      @response ||= api_response
    end
  end
end
