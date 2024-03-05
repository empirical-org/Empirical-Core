require 'rails_helper'

module Evidence
  RSpec.describe PromptResponse do
    let(:fetcher_class) { Evidence::OpenAI::EmbeddingFetcher }
    let(:text) { 'sample text' }

    context 'with stubbed embedding' do
      let(:embedding) { Array.new(described_class::DIMENSION) { rand(-1.0..1.0) } }

      before { allow(fetcher_class).to receive(:run).and_return(embedding) }

      it { expect(described_class.create(text:, embedding:)).to be_valid }
      # it { expect(create(:evidence_prompt_response, text:, embedding:)).to be_valid }
    end

    # context 'with real embedding' do
    #   let(:input) { text }
    #   let(:embedding) { fetcher_class.run(input:, dimension: described_class::DIMENSION, model: described_class::MODEL) }

    #   it { expect(described_class.create(text:, embedding:)).to be_valid }
    #   it { expect(create(:evidence_prompt_response, text:, embedding:)).to be_valid }
    # end

    it { is_expected.to validate_presence_of(:text) }
    # it { is_expected.to validate_uniqueness_of(:text) }
    it { is_expected.to validate_presence_of(:embedding) }
  end
end
