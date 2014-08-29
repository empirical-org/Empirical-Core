require 'spec_helper'

shared_examples_for "student" do

  let(:classroom) { Classroom.new(code: '101') }

  before do
    @student = classroom.students.build(first_name: 'John', last_name: 'Doe')
    @student.generate_student
  end


  context 'if username is not present' do

    let!(:student) { FactoryGirl.build(:student, username: nil) }

    it 'should be valid' do
      expect(student).to be_valid
    end

    context 'when email also missing' do

      before do
        student.email = nil
      end

      it 'should be invalid' do
        expect(student).not_to be_valid
      end

      it 'should have errors on the email attr' do
        expect(student.errors[:email]).not_to be_nil
      end

    end

  end

  describe "#unfinished_activities" do 

    let!(:activity){ FactoryGirl.build(:activity) }  
    let!(:student){ FactoryGirl.build(:student) }

    before do
      @student = classroom.students.build(first_name: 'John', last_name: 'Doe')
      @student.generate_student

    end

    it "must return an empty list when there aren't any available yet" do 
      expect(@student.unfinished_activities(classroom)).to be_empty
    end

    context "when there is one available" do 
      before do 
        student.classroom.activities<<activity
      end
      it "must return one item" do 
        expect(student.unfinished_activities(student.classroom).count).to eq(1) 
      end
    end

  end

  describe "#finished_activities" do 

    #let!(:activity){ Activity.create! }  
    #let!(:student){ FactoryGirl.build(:student) }
    #let!(:classroom_activity) { ClassroomActivity.create(activity_id: activity.id, classroom_id: student.classroom.id) }


    it "must returns an empty list when there aren't available yet" do 
      expect(@student.finished_activities(classroom)).to be_empty
    end

    context "when returns the available elements" do

      #before do
      #  student.save!
      #  student.activity_sessions.create!(classroom_activity_id: classroom_activity.id, activity_id: activity.id, completed_at: Time.now)
      #end
      it "must to return one" do 
        skip "will implement activity tests first and implement this soon"
        #expect(student.finished_activities student.classroom).to be_present
      end

    end

  end

  describe "#activity_sessions" do 
    let!(:activity){ Activity.create! }  
    let!(:student){ FactoryGirl.build(:student) }
    let!(:classroom_activity) { ClassroomActivity.create(activity_id: activity.id, classroom_id: student.classroom.id) }

    it "must returns an empty array when none is assigned" do 
      expect(@student.activity_sessions).to be_empty
    end

    describe "return availables" do
      before do
        student.activity_sessions.build()
      end
      it "must return which are available" do 
        expect(student.activity_sessions).to_not be_empty
      end
    end

    describe "#rel_for_activity" do 

      before do
        student.save!
        student.activity_sessions.create!(classroom_activity_id: classroom_activity.id, activity_id: activity.id)
      end

      it "must not be an empty list" do 
        expect(student.activity_sessions.rel_for_activity(activity)).to_not be_empty
      end

    end
    describe "#for_activity" do 

      before do
        student.save!
        student.activity_sessions.create!(classroom_activity_id: classroom_activity.id, activity_id: activity.id)
      end

      it "must be present" do 
        expect(student.activity_sessions.for_activity(activity)).to be_present
      end

    end

    describe "#completed_for_activity" do 

      before do
        student.save!
        student.activity_sessions.create!(classroom_activity_id: classroom_activity.id, activity_id: activity.id, completed_at: Time.now)
      end

      it "must be present" do 
        expect(student.activity_sessions.completed_for_activity(activity)).to be_present
      end

    end
    describe "#for_classroom" do 
      before do
        student.save!
        student.activity_sessions.create!(classroom_activity_id: classroom_activity.id, activity_id: activity.id, completed_at: Time.now)
      end

      it "must be present" do 
        expect(student.activity_sessions.for_classroom(student.classroom)).to be_present
      end

    end
  end
end
