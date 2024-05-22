# frozen_string_literal: true

module Evidence
  class Check::Plagiarism < Check::Base

    def run
      rule = prompt.rules&.find_by(rule_type: Evidence::Rule::TYPE_PLAGIARISM)
      feedback = get_plagiarism_feedback_from_previous_feedback(previous_feedback, rule)

      if rule.nil? || rule.plagiarism_texts&.none?
        @response = Evidence::PlagiarismCheck.new(entry, '', feedback, rule).feedback_object
      else
        plagiarism_check = nil
        rule.plagiarism_texts.each do |plagiarism_text|
          plagiarism_check = Evidence::PlagiarismCheck.new(entry, plagiarism_text.text, feedback, rule)
          break unless plagiarism_check.feedback_object[:optimal]
        end

        @response = plagiarism_check.feedback_object
      end
    end

    # rubocop:disable Metrics/CyclomaticComplexity
    private def get_plagiarism_feedback_from_previous_feedback(prev, rule)
      previous_plagiarism = prev&.select {|f| f["feedback_type"] == Evidence::Rule::TYPE_PLAGIARISM && f["optimal"] == false } || []
      feedbacks = rule&.feedbacks
      previous_plagiarism.empty? ? feedbacks&.find_by(order: 0)&.text : feedbacks&.find_by(order: 1)&.text
    end
    # rubocop:enable Metrics/CyclomaticComplexity
  end
end
