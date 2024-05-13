# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_llm_configs
#
#  id         :bigint           not null, primary key
#  vendor     :string           not null
#  version    :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
module Evidence
  module Research
    module GenAI
      FactoryBot.define do
        factory :evidence_research_gen_ai_llm_config, class: 'Evidence::Research::GenAI::LLMConfig' do
          vendor { Evidence::Research::GenAI::LLMConfig::VENDOR_MAP.keys.sample }
          version { 'v1.0' }

          trait(:google) { vendor { Evidence::Research::GenAI::LLMConfig::GOOGLE } }
          trait(:open_ai) { vendor { Evidence::Research::GenAI::LLMConfig::OPEN_AI } }
        end
      end
    end
  end
end
