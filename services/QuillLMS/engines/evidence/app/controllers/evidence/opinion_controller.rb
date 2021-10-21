module Evidence
  class OpinionController < ApiController

    def fetch
      oapi_client = Opinion::Client.new(entry: params['entry'], prompt_text: params['prompt_text'])
      assembler = Opinion::FeedbackAssembler.new(oapi_client.post)
      render json: assembler.to_payload
    end
  end
end
