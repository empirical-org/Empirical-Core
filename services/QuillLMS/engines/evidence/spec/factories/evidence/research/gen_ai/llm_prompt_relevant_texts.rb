# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_llm_prompt_relevant_texts
#
#  id               :bigint           not null, primary key
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  llm_prompt_id    :integer          not null
#  relevant_text_id :integer          not null
#
module Evidence
  module Research
    module GenAI
      FactoryBot.define do
        factory :evidence_research_gen_ai_llm_prompt_relevant_text, class: 'Evidence::Research::GenAI::LLMPromptRelevantText' do
          llm_prompt { association :evidence_research_gen_ai_llm_prompt }
          relevant_text { association :evidence_research_gen_ai_relevant_text }
        end
      end
    end
  end
end
