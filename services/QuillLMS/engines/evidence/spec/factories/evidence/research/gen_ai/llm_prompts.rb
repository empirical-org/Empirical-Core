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
      FactoryBot.define do
        factory :evidence_research_gen_ai_llm_prompt, class: 'Evidence::Research::GenAI::LLMPrompt' do
          llm_prompt_template { association :evidence_research_gen_ai_llm_prompt_template }
          prompt { 'This is the prompt' }
        end
      end
    end
  end
end
