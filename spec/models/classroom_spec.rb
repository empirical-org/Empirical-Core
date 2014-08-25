require 'spec_helper'

describe Classroom, :type => :model do

  let(:classroom) { FactoryGirl.build(:classroom) }

  context "when is created" do
    it 'must be valid with valid info' do
    	expect(classroom).to be_valid
    end
  end

  describe "#units" do 
  	describe "#create_next" do
	  	before do 
	  		@classroom = Classroom.create()
	  	end
	  	it "must generate a valid unit" do
	  		expect(@classroom.units.create_next).to be_an_instance_of(Unit) 
	  	end
	end
  end

  context "when is created" do
  	before do 
  		@classroom = Classroom.create()
  	end
  	it "must generate a valid code" do
  		expect(@classroom.code).not_to be_empty
  	end
  end

  describe "#classroom_activity_for" do

  	it "returns an empty list none associated" do
  		#classroom.classroom_activity_for activity
  	end

  end

end
