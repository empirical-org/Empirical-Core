# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_llm_prompts
#
#  id                     :bigint           not null, primary key
#  prompt                 :text             not null
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  llm_prompt_template_id :integer          not null
#
module Evidence
  module Research
    module GenAI
      class LLMPrompt < ApplicationRecord
        belongs_to :llm_prompt_template, class_name: 'Evidence::Research::GenAI::LLMPromptTemplate'

        validates :prompt, presence: true
        validates :llm_prompt_template_id, presence: true

        attr_readonly :prompt, :llm_prompt_template_id

        delegate :description, to: :llm_prompt_template

        def feedback_prompt(response) = "#{prompt}\n\nResponse: #{response}\nFeedback:"
        def evaluation_prompt(response) = "#{prompt}\n\nResponse: #{response}\nParaphrase:"
      end
    end
  end
end
