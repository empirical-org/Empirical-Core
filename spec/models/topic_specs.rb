require 'spec_helper'

describe Topic, :type => :model do

	let!(:topic){FactoryGirl.create(:topic, name: "a")}		

	context "when the default order is by name" do 

		let!(:topic1){FactoryGirl.create(:topic, name: "c")}				
		let!(:topic2){FactoryGirl.create(:topic, name: "b")}		

		it "must be ordered correctly" do 
			expect(Topic.all.map{|x| x.name}).to eq ["a", "b", "c", "topic 1"]

		end
	end

	context "when it's updated/created" do 

		it "must be valid with valid info" do 
			expect(topic.valid?).to be_truthy
		end

		context "when it runs validations" do 
			it "must have a name" do
				topic.name=nil
				topic.valid?
				expect(topic.errors[:name]).to include "can't be blank"
			end

			it "must have a unique name" do 
				t=Topic.first
				n=FactoryGirl.build(:topic, name: t.name)
				n.valid?
				expect(n.errors[:name]).to include "has already been taken"
			end

			it "must have a section" do 
				topic.section_id=nil
				topic.valid?
				expect(topic.errors[:section]).to include "can't be blank"
			end
		end

	end
end
