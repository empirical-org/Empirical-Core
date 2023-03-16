# frozen_string_literal: true

require 'rails_helper'

describe Evidence::Synthetic::Generators::Spelling do
  let(:text1) {'their text'}
  let(:text2) {'no spelling'}

  describe '#generate' do
    let(:spelling) { described_class.new([text1, text2])}

    subject { spelling.run }

    it 'should return spelling results_hash' do
      expect(subject.count).to eq 2
      expect(subject.class).to eq Hash

      generator = subject[text1].first
      expect(generator.name).to eq 'Spelling'
      expect(generator.word).to eq('their')
      expect(generator.results).to eq(['ther text'])

      expect(subject[text2]).to be_empty
    end
  end
end
