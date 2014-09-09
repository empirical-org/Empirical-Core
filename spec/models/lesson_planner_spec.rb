require 'spec_helper'

describe LessonPlanner, :type => :model do

  let(:activity) { FactoryGirl.create(:activity) }
  let(:classroom) { FactoryGirl.build(:classroom) }


  describe "#new" do 

  	it "must receive a classroom as argument and store it" do 
		lp=LessonPlanner.new(classroom)
		expect(lp.classroom).to eq classroom
  	end

  end

  #TODO: extend test
  describe "#build" do 
  	context "with each activities but the classroom activities"

	  	it "must build an array" do 
			lp=LessonPlanner.new(classroom)	  		
			expect(lp.build).to be_an_instance_of Array
	  	end
  end

  describe "#load" do 
  	context "once it's build"
	  	it "must sort and map the instances" do 
			lp=LessonPlanner.new(classroom)	  		
			lp.build
			expect(lp.load.count).to eq 1
			expect(lp.load[0].count).to eq 2
	  	end
  end  

end
