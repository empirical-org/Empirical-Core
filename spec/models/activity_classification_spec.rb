require 'rails_helper'

describe ActivityClassification, type: :model, redis: true do
	it { should have_many(:activities) }
	it { should have_many(:concept_results) }
	it { should validate_presence_of(:key) }

	describe 'unique key' do
		#ref http://www.rubydoc.info/github/thoughtbot/shoulda-matchers/Shoulda%2FMatchers%2FActiveRecord%3Avalidate_uniqueness_of
		#db validation exsits for key
		subject { create(:activity_classification) }
		it { should validate_uniqueness_of(:key) }
	end

	let(:activity_classification){build(:activity_classification) }

	describe "can act as an uid class" do 

	  context "when behaves like uid" do
	    it_behaves_like "uid"
	  end

	end

	describe 'diagnostic' do

		context 'when it exists' do
			let!(:activity_classification) { create(:diagnostic) }

			it 'should find the activity_classification with diagnostic key' do
				expect(ActivityClassification.diagnostic).to eq(activity_classification)
			end
		end

		context 'when it does not exist' do
			it 'should return nil' do
				expect(ActivityClassification.diagnostic).to eq(nil)
			end
		end
	end

	context "when it runs validations" do 

		it "must be valid with valid info" do 
			expect(activity_classification).to be_valid
		end
		
		context "when it fails because" do 

			describe "#key" do 

				it "must be present" do 
					activity_classification.key=nil
					activity_classification.valid?
					expect(activity_classification.errors[:key]).to include "can't be blank"
				end

				it "must be unique" do 
					activity_classification.save!
					second=build(:activity_classification, key: activity_classification.key)
					second.valid?
					expect(second.errors[:key]).to include "has already been taken"
				end
			end
		end
	end


end
