# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_llms
#
#  id         :bigint           not null, primary key
#  order      :integer          not null
#  vendor     :string           not null
#  version    :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe LLM, type: :model do
        let(:factory) { described_class.model_name.singular.to_sym }

        it { expect(build(factory)).to be_valid }

        it { should validate_presence_of(:vendor) }
        it { should validate_presence_of(:version) }
        it { should have_readonly_attribute(:vendor) }
        it { should have_readonly_attribute(:version) }

        describe '#request_body_customizations' do
          subject { llm.request_body_customizations }

          let(:llm) { build(factory, vendor:, version:) }

          context 'when vendor is not GOOGLE or OPEN_AI' do
            let(:vendor) { 'any_vendor' }
            let(:version) { 'any_version' }

            it { is_expected.to eq({}) }
          end

          context 'when vendor is OPEN_AI' do
            let(:vendor) { OPEN_AI }

            context 'when version is GPT_3_5_TURBO_0125' do
              let(:version) { described_class::GPT_3_5_TURBO_0125 }

              it { is_expected.to eq described_class::OPEN_AI_JSON_FORMAT_RESPONSES }
            end

            context 'when version is GPT_4_TURBO_2024_04_09' do
              let(:version) { described_class::GPT_4_TURBO_2024_04_09 }

              it { is_expected.to eq described_class::OPEN_AI_JSON_FORMAT_RESPONSES }
            end

            context 'when version is GPT_4_O' do
              let(:version) { described_class::GPT_4_O }

              it { is_expected.to eq described_class::OPEN_AI_JSON_FORMAT_RESPONSES }
            end
          end

          context 'when vendor is GOOGLE' do
            let(:vendor) { GOOGLE }

            context 'when version is GEMINI_1_5_PRO_LATEST' do
              let(:version) { described_class::GEMINI_1_5_PRO_LATEST }

              it { is_expected.to eq described_class::GOOGLE_JSON_FORMAT_RESPONSES }
            end

            context 'version is GEMINI_1_5_FLASH_LATEST' do
              let(:version) { described_class::GEMINI_1_5_FLASH_LATEST }

              it { is_expected.to eq described_class::GOOGLE_JSON_FORMAT_RESPONSES }
            end

            context 'version is not GEMINI_1_5_PRO_LATEST or GEMINI_1_5_FLASH_LATEST' do
              let(:version) { 'some_other_version' }

              it { is_expected.to eq({}) }
            end
          end
        end

        describe '#set_default_order' do
          subject { llm.order }

          let(:llm) { create(factory) }

          it { is_expected.to eq(1) }

          context 'when there are existing LLMs' do
            let!(:llm1) { create(factory, order: 0) }
            let!(:llm2) { create(factory, order: max_order) }
            let(:max_order) { 10 }

            it { is_expected.to eq(max_order + 1) }
          end

          context 'when order is manually set' do
            let(:llm) { create(factory, order:) }
            let(:order) { 100 }

            it { is_expected.to eq(order) }
          end

          context 'when saving an existing record' do
            let(:llm) { create(factory, order:) }
            let(:order) { 5 }

            it 'does not change the order' do
              llm.touch
              expect(llm.order).to eq(order)
            end
          end
        end
      end
    end
  end
end
