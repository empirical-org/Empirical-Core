# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_passage_prompt_responses
#
#  id                :bigint           not null, primary key
#  response          :text             not null
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  passage_prompt_id :integer          not null
#
module Evidence
  module Research
    module GenAI
      class PassagePromptResponse < ApplicationRecord
        belongs_to :passage_prompt,
          class_name: 'Evidence::Research::GenAI::PassagePrompt'

        has_many :example_prompt_response_feedbacks,
          class_name: 'Evidence::Research::GenAI::ExamplePromptResponseFeedback',
          dependent: :destroy

        has_many :llm_prompt_response_feedbacks,
          class_name: 'Evidence::Research::GenAI::LLMPromptResponseFeedback',
          dependent: :destroy

        validates :response, presence: true
      end
    end
  end
end
