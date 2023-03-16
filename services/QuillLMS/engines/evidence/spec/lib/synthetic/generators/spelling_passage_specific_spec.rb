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

      generator = subject[text1].first
      expect(generator.name).to eq 'SpellingPassage'
      expect(generator.word).to eq('dancing')
      expect(generator.results).to eq(['the dacing step'])
      expect(generator.word_list).to eq(['dancing'])
    end
  end

  describe '#generate - long word' do
    let(:text1) {'the longlonglong word'}
    let(:passage) {'the longlonglong word appears once'}

    subject { described_class.new([text1], passage: passage, random_seed: random_seed).run}

    it 'should return spelling item of long word in passage' do
      expect(subject.count).to eq 1
      expect(subject.class).to eq Hash

      generator = subject[text1].first
      expect(generator.name).to eq 'SpellingPassage'
      expect(generator.word).to eq('longlonglong')
      expect(generator.results).to eq(['the loglonglong word'])
      expect(generator.word_list).to eq(['longlonglong'])
    end
  end
end
