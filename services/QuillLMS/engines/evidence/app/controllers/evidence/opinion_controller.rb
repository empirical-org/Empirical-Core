
module Evidence
  class OpinionController < APIController
    def query 
      # post to opinion-api
      # -> {error: error.type, highlight: []}
      assembler = OpinionFeedbackAssembler.new(error: error, highlights: highlight)
      render json: assembler.to_json
    end
  end
end
