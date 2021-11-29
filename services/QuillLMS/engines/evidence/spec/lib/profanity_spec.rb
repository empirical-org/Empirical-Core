# frozen_string_literal: true

require 'rails_helper'

module Evidence
  RSpec.describe(Profanity) do
    describe '#profane?' do
      it 'should return false given no profanity' do
        stub_const("BadWords::ALL", ['other', 'pumpkin'])
        expect(Profanity.profane?('This sentence has no orange gourds.')).to be false
      end

      it 'should return true given a profane word simple match' do
        stub_const("BadWords::ALL", ['other', 'pumpkin'])
        expect(Profanity.profane?('There is something in a pumpkin')).to be true
      end

      it 'should return true given a profane word simple match case insensitive' do
        stub_const("BadWords::ALL", ['other', 'pumpkin'])
        expect(Profanity.profane?('THERE IS SOMETHING IN A PUMPKIN')).to be true
      end

      it 'should return false given a partial exact match' do
        stub_const("BadWords::ALL", ['other', 'pumpkin'])
        expect(Profanity.profane?('Mother, here is something in a pumpkins')).to be false
      end

      it 'should return true given a profane word regex match right glob' do
        stub_const("BadWords::ALL", ['other', 'pumpkin*'])
        expect(Profanity.profane?('There is something in a pumpkining')).to be true
      end

      it 'should return true given a profane word regex match left glob' do
        stub_const("BadWords::ALL", ['other', '*pumpkin'])
        expect(Profanity.profane?('There is something in a orangepumpkin')).to be true
      end

      it 'should return false given a substring of a bad word' do
        stub_const("BadWords::ALL", ['other', '*pumpkin*'])
        expect(Profanity.profane?('this is not pump')).to be false
      end

      it 'should return true given a profane word regex match left right glob' do
        stub_const("BadWords::ALL", ['other', '*pumpkin*'])
        expect(Profanity.profane?('There is orangepumpkins, everywhere')).to be true
      end

      it 'should return true given a profane word with ending punctuation' do
        stub_const("BadWords::ALL", ['other', 'pumpkin'])
        expect(Profanity.profane?('This is a pumpkin.')).to be true
      end
    end

    describe '#profane_word_check?' do
      it 'should return true given a profane word simple match' do
        stub_const("BadWords::ALL", ['pumpkin'])
        expect(Profanity.profane_word_check?('pumpkin')).to be true
      end

      it 'should return true given a profane word regex match right glob' do
        stub_const("BadWords::ALL", ['pumpkin*'])
        expect(Profanity.profane_word_check?('pumpkins')).to be true
      end

      it 'should return true given a profane word regex match left glob' do
        stub_const("BadWords::ALL", ['*pumpkin'])
        expect(Profanity.profane_word_check?('orangepumpkin')).to be true
      end

      it 'should return false given a substring of a bad word' do
        stub_const("BadWords::ALL", ['*pumpkin*'])
        expect(Profanity.profane_word_check?('pump')).to be false
      end

      it 'should return true given a profane word regex match left right glob' do
        stub_const("BadWords::ALL", ['*pumpkin*'])
        expect(Profanity.profane_word_check?('orangepumpkins')).to be true
      end

      it 'should return true given a profane word with ending punctuation' do
        stub_const("BadWords::ALL", ['pumpkin'])
        expect(Profanity.profane_word_check?('pumpkin.')).to be true
      end

      it 'should return false given a normal word' do
        expect(Profanity.profane_word_check?('bird')).to be false
      end
    end
  end
end
