# frozen_string_literal: true

module Evidence
  module GenAI
    SecondaryFeedbackSet = Struct.new(:activity_id, :prompt_id, :rule_id, :label, :conjunction, :primary, :secondary, :highlights, :sample_entry, keyword_init: true) do
      def to_a
        [activity_id, prompt_id, conjunction, rule_id, label, sample_entry, primary,secondary, highlights.join(ARRAY_DELIMITER)]
      end
    end
  end
end
