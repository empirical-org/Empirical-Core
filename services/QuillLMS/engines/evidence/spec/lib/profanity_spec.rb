require 'rails_helper'

module Evidence
  RSpec.describe(Profanity) do 
    describe '#profane?' do 
      it 'should return true given a profane word simple match' do  
        stub_const("BadWords::ALL", ['pumpkin'])
        expect(Profanity.profane?('pumpkin')).to be true
      end

      it 'should return true given a profane word regex match right glob' do 
        stub_const("BadWords::ALL", ['pumpkin*']) 
        expect(Profanity.profane?('pumpkins')).to be true
      end

      it 'should return true given a profane word regex match left glob' do 
        stub_const("BadWords::ALL", ['*pumpkin']) 
        expect(Profanity.profane?('orangepumpkin')).to be true
      end

      it 'should return false given a substring of a bad word' do 
        stub_const("BadWords::ALL", ['*pumpkin*']) 
        expect(Profanity.profane?('pump')).to be false
      end

      it 'should return true given a profane word regex match left right glob' do 
        stub_const("BadWords::ALL", ['*pumpkin*']) 
        expect(Profanity.profane?('orangepumpkins')).to be true
      end

      it 'should return true given a profane word with ending punctuation' do 
        stub_const("BadWords::ALL", ['pumpkin']) 
        expect(Profanity.profane?('pumpkin.')).to be true
      end

      it 'should return false given a normal word' do 
        expect(Profanity.profane?('bird')).to be false
      end
    end
  end
end
