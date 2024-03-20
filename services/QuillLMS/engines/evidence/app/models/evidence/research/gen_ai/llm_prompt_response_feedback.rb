# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_llm_prompt_response_feedbacks
#
#  id                         :bigint           not null, primary key
#  feedback                   :text             not null
#  label                      :string
#  created_at                 :datetime         not null
#  updated_at                 :datetime         not null
#  passage_prompt_response_id :integer          not null
#
module Evidence
  module Research
    module GenAI
      class LLMPromptResponseFeedback < ApplicationRecord
        belongs_to :passage_prompt_response, class_name: 'Evidence::Research::GenAI::PassagePromptResponse'
        validates :feedback, presence: true
        attr_readonly :feedback, :label, :passage_prompt_response_id

        def self.save_llm_feedback!(passage_prompt_response:, llm_prompt:, llm_client:)
          feedback = llm_client.run(prompt: llm_prompt.feedback_prompt(passage_prompt_response.response))
          create!(feedback:, passage_prompt_response:)
        end
      end
    end
  end
end
