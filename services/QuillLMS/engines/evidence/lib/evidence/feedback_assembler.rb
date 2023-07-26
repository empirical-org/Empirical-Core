# frozen_string_literal: true

module Evidence
  class FeedbackAssembler
    def self.error_to_rule_uid
      raise NotImplementedError, 'Cannot call #error_to_rule_uid on abstract class FeedbackAssembler'
    end

    def self.run(client_response, feedback_history = [])
      error = client_response[error_name]
      return default_payload if error.empty?

      rule_uid = error_to_rule_uid.fetch(error)
      rule = Evidence::Rule.includes(:feedbacks).find_by(uid: rule_uid)
      top_feedback = rule&.determine_feedback_from_history(feedback_history)

      default_payload.merge({
        'concept_uid': rule&.concept_uid,
        'feedback': top_feedback&.text,
        'optimal': rule&.optimal.nil? ? true : rule&.optimal,
        'highlight': client_response['highlight'],
        'rule_uid': rule&.uid,
        'hint': rule&.hint
      })
    end

    def self.default_payload
      {
        'feedback_type': '',
        'labels': '',       # not currently used, but part of Evidence payload spec
        'concept_uid': '',
        'feedback': '<p></p>',
        'optimal': true,
        'highlight': '',
        'rule_uid': ''
      }
    end

    def self.error_name
      raise NotImplementedError, 'Implement in a child class.'
    end
  end
end
