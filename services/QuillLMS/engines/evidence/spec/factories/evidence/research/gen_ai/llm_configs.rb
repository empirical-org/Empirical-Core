# frozen_string_literal: true

# == Schema Information
#
# Table name: comprehension_prompts_rules
#
#  id         :integer          not null, primary key
#  prompt_id  :integer          not null
#  rule_id    :integer          not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
module Evidence
  module Research
    module GenAI
      FactoryBot.define do
        factory :evidence_research_gen_ai_llm_config, class: 'Evidence::Research::GenAI::LLMConfig' do
          vendor { 'the vendor' }
          version { 'v1.0' }
        end
      end
    end
  end
end
