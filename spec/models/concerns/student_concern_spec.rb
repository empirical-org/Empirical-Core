require 'rails_helper'


describe 'Student Concern' do
  let(:teacher) { FactoryGirl.create(:user, role: 'teacher') }
  let(:classroom) { FactoryGirl.create(:classroom, teacher: teacher) }
  let(:student) { FactoryGirl.create(:user, role: 'student', classrooms: [classroom]) }

  let(:activity) { FactoryGirl.create(:activity) }
  let!(:classroom_activity) { FactoryGirl.create(:classroom_activity, classroom: classroom, activity: activity, assigned_student_ids: []) }

  let(:activity2) { FactoryGirl.create(:activity) }
  let!(:classroom_activity2) { FactoryGirl.create(:classroom_activity, classroom: classroom, activity: activity2, assigned_student_ids: []) }

  let!(:as1) { classroom_activity.session_for(student) }
  let!(:as2) { classroom_activity2.session_for(student) }

  before do
    as1.update_attributes(percentage: 1, state: 'finished')
  end

  describe '#percentages_by_classification' do
    it 'includes only completed activity_session' do
      ps = student.percentages_by_classification
      expect(ps).to eq([as1])
    end
  end

  describe '#incomplete_activity_sessions_by_classification' do
    it 'includes only not-completed activity_session' do
      ps = student.incomplete_activity_sessions_by_classification
      expect(ps).to eq([as2])
    end
  end
end
