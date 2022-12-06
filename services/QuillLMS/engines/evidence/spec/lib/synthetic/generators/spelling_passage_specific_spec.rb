# frozen_string_literal: true

require 'rails_helper'

describe Evidence::Synthetic::Generators::SpellingPassageSpecific do
  let(:text1) {'the dancing step'}
  let(:random_seed) {double('seed', rand: 1)}
  let(:passage) {"passage text #{'dancing '* 5}"}

  describe '#generate - repeated word' do
    subject { described_class.new([text1], passage: passage, random_seed: random_seed).run}

    it 'should return spelling item of word common in passage' do
      expect(subject.count).to eq 1
      expect(subject.class).to eq Hash
      expect(subject[text1].count).to eq 1
      expect(subject[text1]['dancing']).to eq 'the dacing step'
    end
  end

  describe '#generate - long word' do
    let(:text1) {'the longlonglong word'}
    let(:passage) {'the longlonglong word appears once'}

    subject { described_class.new([text1], passage: passage, random_seed: random_seed).run}

    it 'should return spelling item of long word in passage' do
      expect(subject.count).to eq 1
      expect(subject.class).to eq Hash
      expect(subject[text1].count).to eq 1
      expect(subject[text1]['longlonglong']).to eq 'the loglonglong word'
    end
  end
end
