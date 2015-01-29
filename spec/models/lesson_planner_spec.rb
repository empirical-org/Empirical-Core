require 'rails_helper'

describe LessonPlanner, :type => :model do

  let!(:activity) { FactoryGirl.create(:activity) }
  let(:classroom) { FactoryGirl.build(:classroom) }
  let(:lesson_planner){ LessonPlanner.new(classroom) }


  describe "#new" do 

    	it "must receive a classroom as argument and store it" do 
    		expect(lesson_planner.classroom).to eq classroom
    	end

  end

  #TODO: extend test
  describe "#build" do 
  	context "with each activities but the classroom activities"

	  	it "must return an array" do 
        expect(lesson_planner.build).to be_an_instance_of Array
	  	end

      context "must build a valid object regarding the arg" do 
        before do 
          lesson_planner.build
        end

        it "must build a first level regarding section position" do 
          expect(lesson_planner).to have_key activity.topic.section.position
        end

        it "must build a second level regarding the section name" do 
          expect(lesson_planner[activity.topic.section.position]).to have_key activity.topic.section.name
        end

        it "must build a third level regarding the topic name" do 
          expect(lesson_planner[activity.topic.section.position][activity.topic.section.name]).to have_key activity.topic.name
        end        

        it "must contain an activity on the las level" do 
          expect(lesson_planner[activity.topic.section.position][activity.topic.section.name][activity.topic.name]).to include activity 
        end

      end
  end

  describe "#load" do 

  	context "once it's build"

	  	it "must sort and map the instances" do 
  			lesson_planner.build
  			expect(lesson_planner.load.count).to eq 1
  			expect(lesson_planner.load[0].count).to eq 2
	  	end

  end  

end
