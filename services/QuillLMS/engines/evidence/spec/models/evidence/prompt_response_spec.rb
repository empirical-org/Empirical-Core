# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_prompt_responses
#
#  id        :integer          not null, primary key
#  embedding :vector(1536)     not null
#  text      :text             not null
#
# Indexes
#
#  index_evidence_prompt_responses_on_text  (text) UNIQUE
#

require 'rails_helper'

module Evidence
  RSpec.describe PromptResponse do
    let(:text) { 'sample text' }

    context 'validations' do
      it { is_expected.to validate_presence_of(:text) }
      it { is_expected.to validate_presence_of(:embedding) }

      context 'uniqueness' do
        subject { FactoryBot.build(:evidence_prompt_response) }

        before { FactoryBot.create(:evidence_prompt_response, text: subject.text) }

        it { is_expected.to validate_uniqueness_of(:text) }
      end
    end

    context 'with stubbed embedding' do
      let(:fetcher_class) { Evidence::OpenAI::EmbeddingFetcher }
      let(:embedding) { Array.new(described_class::DIMENSION) { rand(-1.0..1.0) } }

      before { allow(fetcher_class).to receive(:run).and_return(embedding) }

      it { expect(described_class.create(text:, embedding:)).to be_valid }
      it { expect(create(:evidence_prompt_response, text:, embedding:)).to be_valid }
    end
  end
end
