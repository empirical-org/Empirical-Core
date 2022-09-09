# frozen_string_literal: true

require 'rails_helper'

describe Evidence::Synthetic::Generators::SpellingPassageSpecific do
  let(:text1) {'the hypothetical reason'}
  let(:random_seed) {double('seed', rand: 1)}
  let(:passage) {'the hypothetical part of the longwordsecond'}

  describe '#generate' do
    subject { described_class.new([text1], passage: passage, random_seed: random_seed).run}

    it 'should return spelling item with mispelling of long (10 char+) word' do
      expect(subject.count).to eq 1
      expect(subject.class).to eq Hash
      expect(subject[text1].count).to eq 1
      expect(subject[text1]['hypothetical']).to eq 'the hyothetical reason'
    end
  end
end
