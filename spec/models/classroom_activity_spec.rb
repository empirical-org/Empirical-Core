require 'spec_helper'

describe ClassroomActivity, :type => :model do

  let!(:activity){ FactoryGirl.build(:activity) }  
  let!(:student){ FactoryGirl.build(:student) }   	
  let!(:classroom_activity) { ClassroomActivity.create(activity_id: activity.id, classroom_id: student.classroom.id) }

  describe ".create_session" do 
	  it "must create a new session for the given arguments" do 
	  	expect(ClassroomActivity.create_session(activity, user: student)).to be_valid
	  end
  end

  describe "#assigned_students" do
    it 'must be empty if none assigned' do
    	expect(classroom_activity.assigned_students).to be_empty
    end
    context "when there is an student assigned" do

    	let(:classroom) { Classroom.new(code: '101') }    	
    	before do
	      @student = classroom.students.build(first_name: 'John', last_name: 'Doe')
	      @student.generate_student    		
	      @student.save!
    	end
	    it "must return a list of students which are assigned" do 
	    	classroom_activity=FactoryGirl.build(:classroom_activity, assigned_student_ids: [@student.id])
	    	expect(classroom_activity.assigned_students.first ).to eq(@student)
	    end
	end
  end
  

end
