require 'rails_helper'

describe Workbook, :type => :model do

	let(:workbook){ FactoryGirl.build(:workbook, title: "some title") } 

	context "When it's created" do 

		it "must be valid with valid info" do 
			expect(workbook.valid?).to be_truthy
		end

		context "when it runs validations" do 

			it "title must be required" do
				workbook.title=nil
				workbook.valid?			
				expect(workbook.errors[:title]).to include "can't be blank"
			end
			
		end
		
	end

end
