require 'rails_helper'

describe ClassroomActivity, type: :model do

  let!(:activity){ FactoryGirl.create(:activity) }
  let!(:teacher) { FactoryGirl.create(:user, role: 'teacher') }
  let!(:student){ FactoryGirl.create(:user, role: 'student', username: 'great', name: 'hi hi', password: 'pwd') }
  let!(:classroom) { FactoryGirl.create(:classroom, teacher: teacher, code: 'great', name: 'great', students: [student]) }
  let!(:unit) { FactoryGirl.create(:unit)}
  let!(:classroom_activity) { ClassroomActivity.create(activity: activity, classroom: classroom, unit: unit) }


  describe "#destroy" do
  	it 'should destroy associated activity_sessions' do
  		classroom_activity.destroy
  		expect(student.activity_sessions.count).to eq(0)
  	end
  end

  describe "#assigned_students" do

    it 'must be empty if none assigned' do
    	expect(classroom_activity.assigned_students).to be_empty
    end

    context "when there is an assigned student" do

    	let(:classroom) { Classroom.new(code: '101') }
    	before do
	      @student = classroom.students.build(first_name: 'John', last_name: 'Doe')
	      @student.generate_student(classroom.id)
	      @student.save!
    	end
	    it "must return a list with one element" do
	    	classroom_activity=FactoryGirl.build(:classroom_activity, assigned_student_ids: [@student.id])
	    	expect(classroom_activity.assigned_students.first ).to eq(@student)
	    end
	end
  end

  describe 'gives a checkbox when the teacher' do


    before do
      classroom.update(teacher_id: teacher.id)
    end

    it 'assigns a classroom activity through a custom activity pack' do
      obj = Objective.create(name: 'Build Your Own Activity Pack')
      unit.update(name: 'There is no way a featured activity pack would have this name')
      classroom_activity.save
      expect(classroom_activity.classroom.teacher.checkboxes.last.objective).to eq(obj)
    end

    it 'assigns a classroom activity through a featured activity pack' do
      featured = UnitTemplate.create(name: 'Adverbs')
      obj = Objective.create(name: 'Assign Featured Activity Pack')
      unit.update(name: 'Adverbs')
      classroom_activity.save
      expect(classroom_activity.classroom.teacher.checkboxes.last.objective).to eq(obj)
    end

  end

  context "when it has a due_date_string attribute" do

  	describe "#due_date_string=" do
	  	it "must have a due date setter" do
	  		expect(classroom_activity.due_date_string="03/02/2012").to eq("03/02/2012")
	  	end
	  	it "must throw an exception whn not valid input" do
	  		expect{classroom_activity.due_date_string="03-02-2012"}.to raise_error ArgumentError
	  	end
	end

	describe "#due_date_string" do
		before do
			classroom_activity.due_date_string="03/02/2012"
		end
		it "must have a getter" do
			expect(classroom_activity.due_date_string).to  eq("03/02/2012")
		end
	end

  end

  describe "session_for" do

  		let(:classroom) { FactoryGirl.create(:classroom, code: '101') }
  		let(:student){ classroom.students.create(first_name: 'John', last_name: 'Doe') }

    	before do
	      student.generate_student(classroom.id)
    	end

	  	it "must start a session for the given user" do
	  		expect(classroom_activity.session_for(student)).to be_valid
	  	end
	  	it "must raise an error when user's input is not valid" do
	  		expect{classroom_activity.session_for(0)}.to raise_error
	  	end
  end


end
