require 'spec_helper'

describe Workbook, :type => :model do

	let(:workbook){ FactoryGirl.build(:workbook, title: "some title") } 

	context "When it's created" do 

		it "must be valid with valid info" do 
			expect(workbook.valid?).to be_truthy
		end

		context "when it validates" do 
			it "title must be required" do
				workbook.title=nil
				workbook.valid?			
				expect(workbook.errors[:title]).not_to be_empty
			end
		end
		
	end

end