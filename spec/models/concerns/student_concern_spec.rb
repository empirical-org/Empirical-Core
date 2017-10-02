require 'rails_helper'


describe 'Student Concern' do
  let(:teacher) { FactoryGirl.create(:user, role: 'teacher') }
  let(:classroom) { FactoryGirl.create(:classroom, teacher: teacher) }
  let(:classroom2) { FactoryGirl.create(:classroom, teacher: teacher) }
  let(:student) { FactoryGirl.create(:user, role: 'student', classrooms: [classroom]) }

  let(:activity) { FactoryGirl.create(:activity) }
  let!(:classroom_activity) { FactoryGirl.create(:classroom_activity, classroom: classroom, activity: activity, assigned_student_ids: []) }
  let!(:classroom_activity_for_class2) { FactoryGirl.create(:classroom_activity, classroom: classroom2, activity: activity, assigned_student_ids: []) }

  let(:activity2) { FactoryGirl.create(:activity) }
  let(:activity3) { FactoryGirl.create(:activity) }
  let!(:classroom_activity2) { FactoryGirl.create(:classroom_activity, classroom: classroom, activity: activity2, assigned_student_ids: []) }

  let!(:as1) { classroom_activity.session_for(student) }
  let!(:as2) { classroom_activity2.session_for(student) }

  before do
    as1.update_attributes(percentage: 1, state: 'finished')
  end

  describe '#assign_classroom_activities' do
    it "does not assign any new activities if the student already has them" do
      old_act_sesh_count = ActivitySession.count
      student.assign_classroom_activities
      expect(old_act_sesh_count).to eq(ActivitySession.count)
    end

    context "when a student joins a new classroom" do

      it "assigns the new classrooms activities to the student" do
        old_act_sesh_count = student.activity_sessions.count
        Associators::StudentsToClassrooms.run(student, classroom2)
        expect(old_act_sesh_count).to be < student.activity_sessions.count
      end

    end
  end
end
