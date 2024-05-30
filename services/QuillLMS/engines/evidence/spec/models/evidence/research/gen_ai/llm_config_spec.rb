# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_llm_configs
#
#  id         :bigint           not null, primary key
#  vendor     :string
#  version    :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe LLMConfig, type: :model do
        it { should validate_presence_of(:vendor) }
        it { should validate_presence_of(:version) }
        it { should have_readonly_attribute(:vendor) }
        it { should have_readonly_attribute(:version) }

        it { expect(FactoryBot.build(:evidence_research_gen_ai_llm_config)).to be_valid }

        describe '#request_body_customizations' do
          subject { llm_config.request_body_customizations }

          let(:llm_config) { build(:evidence_research_gen_ai_llm_config, vendor:, version:) }

          context 'when vendor is not GOOGLE or OPEN_AI' do
            let(:vendor) { 'any_vendor' }
            let(:version) { 'any_version' }

            it { is_expected.to eq({}) }
          end

          context 'when vendor is OPEN_AI' do
            let(:vendor) { OPEN_AI }

            context 'when version is GPT_3_5_TURBO_0125' do
              let(:version) { described_class::GPT_3_5_TURBO_0125 }

              it { is_expected.to eq described_class::OPEN_AI_JSON_FORMAT_RESPONSES  }
            end

            context 'when version is GPT_4_TURBO_2024_04_09' do
              let(:version) { described_class::GPT_4_TURBO_2024_04_09 }

              it { is_expected.to eq described_class::OPEN_AI_JSON_FORMAT_RESPONSES  }
            end

            context 'when version is GPT_4_O' do
              let(:version) { described_class::GPT_4_O }

              it { is_expected.to eq described_class::OPEN_AI_JSON_FORMAT_RESPONSES  }
            end
          end

          context 'when vendor is GOOGLE' do
            let(:vendor) { GOOGLE }

            context 'when version is GEMINI_1_5_PRO_LATEST' do
              let(:version) { described_class::GEMINI_1_5_PRO_LATEST }

              it { is_expected.to eq described_class::GOOGLE_JSON_FORMAT_RESPONSES  }
            end

            context 'version is GEMINI_1_5_FLASH_LATEST' do
              let(:version) { described_class::GEMINI_1_5_FLASH_LATEST }

              it { is_expected.to eq described_class::GOOGLE_JSON_FORMAT_RESPONSES  }
            end

            context 'version is not GEMINI_1_5_PRO_LATEST or GEMINI_1_5_FLASH_LATEST' do
              let(:version) { 'some_other_version' }

              it { is_expected.to eq({}) }
            end
          end
        end
      end
    end
  end
end
