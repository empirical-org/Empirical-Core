module Evidence 
  class OpinionFeedbackAssembler
    OAPI_ERROR_TO_RULE_UID = {
      'test' => 'test'
    }


    def initialize(oapi_response)
      @oapi_response = oapi_response
      error = @oapi_response['oapi_error']
      rule_uid = OAPI_ERROR_TO_RULE_UID[error]
      @rule = Evidence::Rule.where(uid: rule_uid).includes(:feedbacks).first
      @top_feedback = nil 
      if @rule&.feedbacks 
        @top_feedback = @rule&.feedbacks.min_by { |e| e.order }
      end
      
    end

    def to_json 
      {
        'concept_uid': @rule&.concept_uid,
        'feedback': @top_feedback&.text,
        'feedback_type': 'opinion',
        'optimal': @rule&.optimal,
        'response_id': '0', # not currently used, but part of Evidence payload spec
        'highlight': @oapi_response['highlight'],
        'labels': '',       # not currently used, but part of Evidence payload spec
        'rule_uid': @rule&.uid
      }  
    end

  end
end



