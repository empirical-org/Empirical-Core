# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_llm_feedbacks
#
#  id                         :bigint           not null, primary key
#  label                      :string
#  text                       :text             not null
#  created_at                 :datetime         not null
#  updated_at                 :datetime         not null
#  experiment_id              :integer          not null
#  passage_prompt_response_id :integer          not null
#
module Evidence
  module Research
    module GenAI
      class LLMFeedback < ApplicationRecord
        include HasOptimalAndSubOptimal

        belongs_to :experiment, class_name: 'Evidence::Research::GenAI::Experiment'
        belongs_to :passage_prompt_response, class_name: 'Evidence::Research::GenAI::PassagePromptResponse'

        validates :text, presence: true
        validates :passage_prompt_response_id, presence: true
        validates :experiment_id, presence: true

        attr_readonly :experiment_id, :label, :passage_prompt_response_id, :text

        delegate :example_optimal?, to: :passage_prompt_response

        def example_sub_optimal? = !example_optimal?

        def response_and_feedback = "Response: #{passage_prompt_response.response}\nFeedback: #{text}"
      end
    end
  end
end
