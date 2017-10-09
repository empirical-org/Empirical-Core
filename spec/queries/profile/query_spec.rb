require 'rails_helper'

describe 'Profile::Query' do
  let(:teacher) { FactoryGirl.create(:user, role: 'teacher') }
  let(:classroom) { FactoryGirl.create(:classroom, teacher: teacher) }
  let(:student) { FactoryGirl.create(:user, role: 'student') }

  let(:activity) { FactoryGirl.create(:activity) }
  let(:unit1) { FactoryGirl.create(:unit) }
  let!(:classroom_activity) { FactoryGirl.create(:classroom_activity,
                                                  classroom: classroom,
                                                  activity: activity,
                                                  assign_on_join: true,
                                                  unit: unit1) }

  let(:activity2) { FactoryGirl.create(:activity) }
  let!(:unit2) { FactoryGirl.create(:unit) }
  let!(:classroom_activity2) { FactoryGirl.create(:classroom_activity,
                                                  classroom: classroom,
                                                  activity: activity2,
                                                  assign_on_join: true,
                                                  unit: unit2) }

  def sessions
    Profile::Query.new.query(student, 20, 0, classroom.id)
  end

  before do
    StudentsClassrooms.create(student_id: student.id, classroom_id: classroom.id)
  end

  it 'returns no activity sessions if there are any activity sessions' do
    expect(sessions.count).to eq(0)
  end

  it 'returns one activity sessions if there is one per the classroom' do
    ActivitySession.create(user_id: student.id, classroom_activity_id: classroom.id, state: 'finished', completed_at: Date.yesterday, percentage: 0.9)
    expect(sessions.count).to eq(1)
  end


end
