# frozen_string_literal: true

module Evidence
  class AutomlCheck

    attr_reader :entry, :prompt

    def initialize(entry, prompt, previous_feedback=[])
      @entry = entry
      @prompt = prompt
      @automl_model = prompt&.automl_models&.where(state: AutomlModel::STATE_ACTIVE)&.first
      @previous_feedback = previous_feedback
    end

    # rubocop:disable Metrics/CyclomaticComplexity
    def feedback_object
      return unless matched_rule

      feedback = matched_rule.determine_feedback_from_history(@previous_feedback)
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
        optimal: matched_rule.optimal,
        entry: @entry,
        concept_uid: matched_rule&.concept_uid || '',
        rule_uid: matched_rule&.uid || '',
        hint: matched_rule&.hint,
        highlight: highlight
      }
    end
    # rubocop:enable Metrics/CyclomaticComplexity

    private def matched_rule
      @matched_rule ||= fetch_matched_rule
    end

    private def fetch_matched_rule
      return unless @automl_model

      google_automl_label = @automl_model.fetch_automl_label(@entry)
      @prompt.rules.joins(:label).find_by(comprehension_labels: {name: google_automl_label})
    end
  end
end
