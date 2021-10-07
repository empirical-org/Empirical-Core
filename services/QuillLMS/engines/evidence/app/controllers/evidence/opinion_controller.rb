module Evidence
  class OpinionController < ApiController
    API_TIMEOUT = 5
    def fetch
      oapi_response = Timeout.timeout(API_TIMEOUT) do 
        HTTParty.post(
          ENV['OPINION_API_DOMAIN'], 
          headers:  {'Content-Type': 'application/json'},
          body:     {
            entry: params['entry'],
            prompt_text: params['prompt_text']
          }.to_json
        )
      end

      assembler = OpinionFeedbackAssembler.new(oapi_response)
      render json: assembler.to_payload
    end
  end
end
