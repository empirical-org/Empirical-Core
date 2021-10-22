module Evidence 
  class FeedbackAssembler

    def self.error_to_rule_uid 
      { } # specify in class descendents
    end

    def self.run(client_response)
      error = client_response['oapi_error']
      return default_payload if error.empty?

      rule_uid = error_to_rule_uid.fetch(error)
      rule = Evidence::Rule.where(uid: rule_uid).includes(:feedbacks).first
      top_feedback = rule&.feedbacks&.min_by(&:order)

      default_payload.merge({
        'concept_uid': rule&.concept_uid,
        'feedback': top_feedback&.text,
        'optimal': rule&.optimal.nil? ? true : rule&.optimal,
        'highlight': client_response['highlight'],
        'rule_uid': rule&.uid
      })
    end

    def self.default_payload
      {
        'feedback_type': '',
        'response_id': '0', # not currently used, but part of Evidence payload spec
        'labels': '',       # not currently used, but part of Evidence payload spec
        'concept_uid': '',
        'feedback': '',
        'optimal': true,
        'highlight': '',
        'rule_uid': ''
      }  
    end
  end
    
end
