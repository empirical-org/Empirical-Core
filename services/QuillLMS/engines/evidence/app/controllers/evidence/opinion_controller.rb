# frozen_string_literal: true

module Evidence
  class OpinionController < ApiController

    def fetch
      oapi_client = Opinion::Client.new(entry: params['entry'], prompt_text: params['prompt_text'])
      render json: Opinion::FeedbackAssembler.run(oapi_client.post)
    end
  end
end
