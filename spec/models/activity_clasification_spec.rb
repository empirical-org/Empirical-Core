require 'rails_helper'

describe ActivityClassification, :type => :model do

	let(:activity_classification){FactoryGirl.build(:activity_classification) }

	describe "can act as an uid class" do 

	  context "when behaves like uid" do
	    it_behaves_like "uid"
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
					second=FactoryGirl.build(:activity_classification, key: activity_classification.key)
					second.valid?
					expect(second.errors[:key]).to include "has already been taken"
				end
			end
		end
	end


end
