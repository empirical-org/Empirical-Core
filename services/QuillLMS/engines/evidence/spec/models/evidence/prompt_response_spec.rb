# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_prompt_responses
#
#  id        :bigint           not null, primary key
#  embedding :vector(1536)     not null
#  text      :text             not null
#  prompt_id :integer          not null
#

require 'rails_helper'

module Evidence
  RSpec.describe PromptResponse do
    let(:text) { 'sample text' }

    context 'validations' do
      it { is_expected.to validate_presence_of(:prompt) }
      it { is_expected.to validate_presence_of(:text) }
      it { is_expected.to validate_presence_of(:embedding) }

      context 'uniqueness' do
        subject { FactoryBot.build(:evidence_prompt_response) }

        before { FactoryBot.create(:evidence_prompt_response, text: subject.text) }

        it { is_expected.to validate_uniqueness_of(:text) }
      end
    end

    context 'with stubbed embedding' do
      subject { FactoryBot.build(:evidence_prompt_response, text:, embedding: initial_embedding) }

      let(:fetcher_class) { Evidence::OpenAI::EmbeddingFetcher }
      let(:initial_embedding) { nil }
      let(:embedding) { Array.new(Evidence::PromptResponse::DIMENSION) { rand(-1.0..1.0) } }

      before { allow(fetcher_class).to receive(:run).and_return(embedding) }

      context 'when text is present and embedding is nil' do
        it 'sets the embedding' do
          subject.validate
          expect(subject.embedding).to eq embedding
        end
      end

      context 'when text is present and embedding is already set' do
        let(:initial_embedding) { embedding }

        it 'does not change the existing embedding' do
          subject.validate
          expect(subject.embedding).to eq initial_embedding
          expect(fetcher_class).not_to receive(:run)
        end
      end

      context 'when text is nil' do
        let(:text) { nil }

        it 'does not set the embedding' do
          subject.validate
          expect(subject.embedding).to be_nil
          expect(fetcher_class).not_to receive(:run)
        end
      end
    end
  end
end
