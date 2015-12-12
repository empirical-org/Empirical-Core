require 'rails_helper'

describe 'ActivitySessionsQuery' do
  let!(:teacher) { FactoryGirl.create(:user, role: 'teacher') }
  let!(:classroom) { FactoryGirl.create(:classroom, teacher: teacher) }
  let!(:student) { FactoryGirl.create(:user, role: 'student', classcode: classroom.code) }
  let!(:activity) { FactoryGirl.create(:activity) }
  let!(:activity_session) { FactoryGirl.create(:activity_session, user: student, activity: activity) }

  let!(:activity_sessions_query) { Scorebook::ActivitySessionsQuery.new }

  def subject
    activity_sessions_query.query(teacher, classroom.id)
  end

  # FIXME: break this method out into a separate class so were not testing a private method
  it 'works' do
    sessions = subject
    expect(sessions).to_not be_empty
  end
end
