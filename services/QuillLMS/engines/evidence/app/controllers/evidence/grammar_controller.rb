# frozen_string_literal: true

module Evidence
  class GrammarController < ApiController

    def fetch
      oapi_client = Grammar::Client.new(entry: params['entry'], prompt_text: params['prompt_text'])
      render json: Grammar::FeedbackAssembler.run(oapi_client.post)
    end
  end
end
