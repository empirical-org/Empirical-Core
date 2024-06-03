# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_llm_feedbacks
#
#  id                         :bigint           not null, primary key
#  label                      :string
#  raw_text                   :text             not null
#  text                       :text             not null
#  created_at                 :datetime         not null
#  updated_at                 :datetime         not null
#  passage_prompt_response_id :integer          not null
#  trial_id                   :integer          not null
#
module Evidence
  module Research
    module GenAI
      class LLMFeedback < ApplicationRecord
        include HasOptimalAndSubOptimal

        belongs_to :trial, class_name: 'Evidence::Research::GenAI::Trial'
        belongs_to :passage_prompt_response, class_name: 'Evidence::Research::GenAI::PassagePromptResponse'

        validates :raw_text, presence: true
        validates :text, presence: true
        validates :passage_prompt_response_id, presence: true
        validates :trial_id, presence: true

        attr_readonly :trial_id, :label, :passage_prompt_response_id, :raw_text, :text

        delegate :example_optimal?, :example_feedback, to: :passage_prompt_response

        def identical_feedback? = example_feedback.text.strip == text.strip

        def optimal_or_sub_optimal_match? = example_optimal? ? optimal? : sub_optimal?

        def response_and_feedback = "Response: #{passage_prompt_response.response}\nFeedback: #{text}"

        def to_s = text
      end
    end
  end
end
