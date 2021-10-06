module Evidence 
  class OpinionFeedbackAssembler
    OAPI_ERROR_TO_RULE_UID = {

    }


    def initalize(error:, highlight:)
      rule_uid = OAPI_ERROR_TO_RULE_UID[error]
      @rule = Evidence::Rule.find_by_uid(rule_uid).include(:feedbacks)
      # NewRelic.notice_error ? if nil

      @top_feedback = @rule&.feedbacks.min_by { |e| e.order }
      
    end

    def to_json 
      {
        "concept_uid": @rule&.concept_uid
        "feedback": @top_feedback&.text,
        "feedback_type": "opinion",
        "optimal": @rule&.optimal,
        "response_id": "0", # not currently used, but part of Evidence payload spec
        "highlight": [],
        "labels": "",       # not currently used, but part of Evidence payload spec
        "rule_uid": @rule&.uid
      }  
    end
  end
end



