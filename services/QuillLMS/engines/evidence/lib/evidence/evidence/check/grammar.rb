# frozen_string_literal: true

module Evidence
  class Check::Grammar < Check::Base

    def run
      grammar_client = Grammar::Client.new(entry: entry, prompt_text: prompt.text)
      @response = Grammar::FeedbackAssembler.run(grammar_client.post)
    end

  end
end
