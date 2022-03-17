# frozen_string_literal: true

module Evidence
  class Check::Opinion < Check::Base

    def run
      opinion_client = Opinion::Client.new(entry: entry, prompt_text: prompt.text)
      @response = Opinion::FeedbackAssembler.run(opinion_client.post)
    end

  end
end
