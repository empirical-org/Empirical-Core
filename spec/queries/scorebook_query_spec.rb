require 'rails_helper'

describe 'ScorebookQuery' do
  let!(:teacher) { FactoryGirl.create(:user, role: 'teacher') }
  let!(:classroom) { FactoryGirl.create(:classroom, teacher: teacher) }
  let!(:student) { FactoryGirl.create(:user, role: 'student', classcode: classroom.code) }
  let!(:activity) { FactoryGirl.create(:activity) }
  let!(:activity_session) { FactoryGirl.create(:activity_session, user: student, activity: activity) }

  let!(:scorebook) { Scorebook.new(teacher) }

  def subject
    scorebook.scores
  end

  # FIXME: break this method out into a separate class so were not testing a private method
  it '#student_activity_sessions' do
    sessions = scorebook.send(:student_activity_sessions, classroom.id)
    expect(sessions).to_not be_empty
  end

end