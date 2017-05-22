require 'rails_helper'

describe 'Services:UsernameGenerator' do

  describe 'when a student has the same name as another student' do
    context 'in a class' do

      it "resolves the issue by adding a number to their name" do
        FactoryGirl.create(:student, username: 'sean.spicer@press-secretary')
        username = UsernameGenerator.run('sean','spicer','press-secretary')
        expect(username).to eq('sean.spicer1@press-secretary')
      end

      context 'with another student with a number after the name' do
        it "resolves the issue by making a bigger number" do
          FactoryGirl.create(:student, username: 'sean.spicer@press-secretary')
          FactoryGirl.create(:student, username: 'sean.spicer1@press-secretary')
          username = UsernameGenerator.run('sean','spicer','press-secretary')
          expect(username).to eq('sean.spicer2@press-secretary')
        end
      end

      context 'and the student has a number after their name' do
        it "resolves the issue by making a bigger number" do
          FactoryGirl.create(:student, username: 'sean.spicer1@press-secretary')
          username = UsernameGenerator.run('sean','spicer1','press-secretary')
          expect(username).to eq('sean.spicer12@press-secretary')
        end
      end
    end

    context 'in a different class' do
      it "generates a username in the first.lastname@classcode format" do
        FactoryGirl.create(:student, username: 'sean.spicer@chews-gum')
        username = UsernameGenerator.run('sean','spicer','press-secretary')
        expect(username).to eq('sean.spicer@press-secretary')
      end
    end

  end

  describe 'when a student has a unique name' do
    it "generates a username in the first.lastname@classcode format" do
      FactoryGirl.create(:student, username: 'sean.spicer@chews-gum')
      username = UsernameGenerator.run('sean','spicer','press-secretary')
      expect(username).to eq('sean.spicer@press-secretary')
    end
  end




end
