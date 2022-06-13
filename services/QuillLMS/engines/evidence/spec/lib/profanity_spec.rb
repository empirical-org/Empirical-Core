# frozen_string_literal: true

require 'rails_helper'

module Evidence
  RSpec.describe(Profanity) do
    describe '#profane' do
      it 'should return nil given no profanity' do
        stub_const("BadWords::ALL", ['other', 'pumpkin'])
        expect(Profanity.profane('This sentence has no orange gourds.')).to be nil
      end

      it 'should return truthy given a profane word simple match' do
        stub_const("BadWords::ALL", ['other', 'pumpkin'])
        expect(Profanity.profane('There is something in a pumpkin')).to be_truthy
      end

      it 'should return truthy given a profane word simple match case insensitive' do
        stub_const("BadWords::ALL", ['other', 'pumpkin'])
        expect(Profanity.profane('THERE IS SOMETHING IN A PUMPKIN')).to be_truthy
      end

      it 'should return nil given a partial exact match' do
        stub_const("BadWords::ALL", ['other', 'pumpkin'])
        expect(Profanity.profane('Mother, here is something in a pumpkins')).to be nil
      end

      it 'should return truthy given a profane word regex match right glob' do
        stub_const("BadWords::ALL", ['other', 'pumpkin*'])
        expect(Profanity.profane('There is something in a pumpkining')).to be_truthy
      end

      it 'should return truthy given a profane word regex match left glob' do
        stub_const("BadWords::ALL", ['other', '*pumpkin'])
        expect(Profanity.profane('There is something in a orangepumpkin')).to be_truthy
      end

      it 'should return nil given a substring of a bad word' do
        stub_const("BadWords::ALL", ['other', '*pumpkin*'])
        expect(Profanity.profane('this is not pump')).to be nil
      end

      it 'should return truthy given a profane word regex match left right glob' do
        stub_const("BadWords::ALL", ['other', '*pumpkin*'])
        expect(Profanity.profane('There is orangepumpkins, everywhere')).to be_truthy
      end

      it 'should return truthy given a profane word with ending punctuation' do
        stub_const("BadWords::ALL", ['other', 'pumpkin'])
        expect(Profanity.profane('This is a pumpkin.')).to be_truthy
      end
    end

    describe '#profane_word_check' do
      it 'should return truthy given a profane word simple match' do
        stub_const("BadWords::ALL", ['pumpkin'])
        expect(Profanity.profane_word_check('pumpkin')).to be_truthy
      end

      it 'should return truthy given a profane word regex match right glob' do
        stub_const("BadWords::ALL", ['pumpkin*'])
        expect(Profanity.profane_word_check('pumpkins')).to be_truthy
      end

      it 'should return truthy given a profane word regex match left glob' do
        stub_const("BadWords::ALL", ['*pumpkin'])
        expect(Profanity.profane_word_check('orangepumpkin')).to be_truthy
      end

      it 'should return nil given a substring of a bad word' do
        stub_const("BadWords::ALL", ['*pumpkin*'])
        expect(Profanity.profane_word_check('pump')).to be nil
      end

      it 'should return truthy given a profane word regex match left right glob' do
        stub_const("BadWords::ALL", ['*pumpkin*'])
        expect(Profanity.profane_word_check('orangepumpkins')).to be_truthy
      end

      it 'should return truthy given a profane word with ending punctuation' do
        stub_const("BadWords::ALL", ['pumpkin'])
        expect(Profanity.profane_word_check('pumpkin.')).to be_truthy
      end

      it 'should return nil given a normal word' do
        expect(Profanity.profane_word_check('bird')).to be nil
      end
    end
  end
end
