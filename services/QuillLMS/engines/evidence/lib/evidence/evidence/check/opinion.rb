# frozen_string_literal: true

module Evidence
  class Check::Opinion < Check::Base

    def run
      opinion_client = ::Evidence::Opinion::Client.new(entry: entry, prompt_text: prompt.text)
      @response = ::Evidence::Opinion::FeedbackAssembler.run(opinion_client.post, previous_feedback)
    end

  end
end
