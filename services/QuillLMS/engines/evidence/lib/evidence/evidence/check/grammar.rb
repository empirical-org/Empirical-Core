# frozen_string_literal: true

module Evidence
  class Check::Grammar < Check::Base

    def run
      grammar_client = ::Evidence::Grammar::Client.new(entry: entry, prompt_text: prompt.text)
      @response = ::Evidence::Grammar::FeedbackAssembler.run(grammar_client.post)
    end

  end
end
