require 'rails_helper'

describe ChapterShim, :type => :model do

	let(:activity){FactoryGirl.build(:activity)}
	let(:chapter_shim){ChapterShim.new(activity)}

	describe "#assessment" do 

		it "must iniatialize the intance" do 
			expect(chapter_shim.assessment).to eq chapter_shim
		end

	end

	describe "#story_instructions" do 
		 it "must store the data instructions" do 
		 	expect(chapter_shim.story_instructions).to eq activity.data['instructions']
		 end
	end

	describe "#article_header" do 
		it "must contain the name" do 
			expect(chapter_shim.article_header).to eq activity.name
		end

	end

end
