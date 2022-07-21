# frozen_string_literal: true

module Evidence
  class AutomlCheck

    LOW_CONFIDENCE_THRESHOLD = 0.6

    attr_reader :entry, :prompt

    def initialize(entry, prompt, previous_feedback=[])
      @entry = entry
      @prompt = prompt
      @automl_model = prompt&.automl_models&.where(state: AutomlModel::STATE_ACTIVE)&.first
      @previous_feedback = previous_feedback
    end

    # rubocop:disable Metrics/CyclomaticComplexity
    def feedback_object
      return unless matched_automl_rule

      if matched_low_confidence_rule
        feedback = matched_low_confidence_rule.determine_feedback_from_history(@previous_feedback)
        highlight = feedback.highlights.map do |h|
          {
            type: h.highlight_type,
            text: h.text,
            category: ''
          }
        end
        {
          feedback: feedback.text,
          feedback_type: Rule::TYPE_LOW_CONFIDENCE,
          optimal: matched_low_confidence_rule.optimal,
          entry: @entry,
          concept_uid: matched_low_confidence_rule&.concept_uid || '',
          rule_uid: matched_low_confidence_rule&.uid || '',
          hint: matched_low_confidence_rule&.hint,
          highlight: highlight,
          api: {
            original_rule_confidence: @confidence_score,
            original_rule_uid: matched_automl_rule&.uid,
            original_rule_name: matched_automl_rule&.name
          }
        }
      else
        feedback = matched_automl_rule.determine_feedback_from_history(@previous_feedback)
        highlight = feedback.highlights.map do |h|
          {
            type: h.highlight_type,
            text: h.text,
            category: ''
          }
        end
        {
          feedback: feedback.text,
          feedback_type: Rule::TYPE_AUTOML,
          optimal: matched_automl_rule.optimal,
          entry: @entry,
          concept_uid: matched_automl_rule&.concept_uid || '',
          rule_uid: matched_automl_rule&.uid || '',
          hint: matched_automl_rule&.hint,
          highlight: highlight,
          api: {
            confidence: @confidence_score
          }
        }
      end
    end
    # rubocop:enable Metrics/CyclomaticComplexity

    private def matched_low_confidence_rule
      return unless matched_automl_rule && !matched_automl_rule.optimal && @confidence_score < LOW_CONFIDENCE_THRESHOLD

      @matched_low_confidence_rule ||= fetch_matched_low_confidence_rule
    end

    private def fetch_matched_low_confidence_rule
      @prompt.rules&.find_by(rule_type: Evidence::Rule::TYPE_LOW_CONFIDENCE)
    end

    private def matched_automl_rule
      @matched_automl_rule ||= fetch_matched_automl_rule
    end

    private def fetch_matched_automl_rule
      return unless @automl_model

      google_automl_label, @confidence_score = @automl_model.fetch_automl_label(@entry)
      @prompt.rules.joins(:label).find_by(comprehension_labels: {name: google_automl_label})
    end
  end
end
