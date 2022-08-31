# frozen_string_literal: true

require 'rails_helper'

describe Evidence::Synthetic::Generators::Spelling do
  let(:text1) {'their text'}
  let(:text2) {'no spelling'}

  describe '#generate' do
    let(:spelling) { Evidence::Synthetic::Generators::Spelling.new([text1, text2])}

    it 'should return spelling results_hash' do
      result = spelling.run

      expect(result.count).to eq 2
      expect(result.class).to eq Hash
      expect(result[text1]['their']).to eq 'ther text'
      expect(result[text2]).to be_empty
    end
  end
end
