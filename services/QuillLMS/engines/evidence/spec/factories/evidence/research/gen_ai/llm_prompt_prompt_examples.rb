# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_llm_prompt_prompt_examples
#
#  id                :bigint           not null, primary key
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  llm_prompt_id     :integer          not null
#  prompt_example_id :integer          not null
#
module Evidence
  module Research
    module GenAI
      FactoryBot.define do
        factory :evidence_research_gen_ai_llm_prompt_prompt_example, class: 'Evidence::Research::GenAI::LLMPromptPromptExample' do
          llm_prompt { association :evidence_research_gen_ai_llm_prompt }
          prompt_example { association :evidence_research_gen_ai_prompt_example }
        end
      end
    end
  end
end
