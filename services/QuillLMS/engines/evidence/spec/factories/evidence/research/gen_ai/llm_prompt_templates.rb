# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_llm_prompt_templates
#
#  id          :bigint           not null, primary key
#  contents    :text             not null
#  description :text             not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
module Evidence
  module Research
    module GenAI
      FactoryBot.define do
        factory :evidence_research_gen_ai_llm_prompt_template, class: 'Evidence::Research::GenAI::LLMPromptTemplate' do
          contents { 'This is the prompt template'}
          description { 'The best prompt engineering ever' }
        end
      end
    end
  end
end
