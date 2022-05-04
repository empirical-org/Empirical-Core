# frozen_string_literal: true

module Evidence
  class FeedbackAssembler
    def self.error_to_rule_uid
      raise NotImplementedError, 'Cannot call #error_to_rule_uid on abstract class FeedbakAssembler'
    end

    def self.run(client_response)
      error = client_response[error_name]
      return default_payload if error.empty?

      rule_uid = error_to_rule_uid.fetch(error)
      rule = Evidence::Rule.where(uid: rule_uid).includes(:feedbacks).first
      top_feedback = rule&.feedbacks&.min_by(&:order)

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
