# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_llm_prompt_guidelines
#
#  id            :bigint           not null, primary key
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  guideline_id  :integer          not null
#  llm_prompt_id :integer          not null
#
module Evidence
  module Research
    module GenAI
      FactoryBot.define do
        factory :evidence_research_gen_ai_llm_prompt_guideline, class: 'Evidence::Research::GenAI::LLMPromptGuideline' do
          llm_prompt { association :evidence_research_gen_ai_llm_prompt }
          guideline { association :evidence_research_gen_ai_guideline }
        end
      end
    end
  end
end
