
module Evidence
  class OpinionController < ApiController
    API_TIMEOUT = 5
    def fetch
      # wrap in timeout block?
      oapi_response = Timeout::timeout(API_TIMEOUT) do 
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
      render json: assembler.to_json
    end
  end
end


# ENV['OPINION_API_DOMAIN']
# https://opinion-api.quill.org




# response = HTTParty.post(FEEDBACK_URL,
# headers: {'Content-Type': 'application/json'},
# body: {
#   session_id: SESSION_ID,
#   prompt_id: row['prompt_id'].to_i,
#   prompt_text: row['stem'],
#   entry: row['entry'],
#   attempt: 1,
#   previous_feedback: [],
# }.to_json