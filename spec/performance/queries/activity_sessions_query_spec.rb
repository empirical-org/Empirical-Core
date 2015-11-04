require 'rails_helper'
require 'benchmark'

describe 'Scorebook' do

  let!(:teacher) { FactoryGirl.create(:user, role: 'teacher') }
  let!(:classroom) { FactoryGirl.create(:classroom, teacher: teacher) }
  let!(:student) { FactoryGirl.create(:user, role: 'student', classcode: classroom.code) }
  let!(:activity) { FactoryGirl.create(:activity) }
  let!(:activity_sessions) { FactoryGirl.create_list(:activity_session, 200, user: student, activity: activity) }

  let!(:concept) { FactoryGirl.create(:concept) }

  let!(:activity_sessions_query) { ActivitySessionsQuery.new }

  before do
    activity_sessions.map{ |as| FactoryGirl.create_list(:concept_result, 30, concept: concept, activity_session: as) }
  end

  def subject
    activity_sessions_query.query(teacher, classroom.id)
  end

  it 'it takes less than 1 sec' do
    time = Benchmark.realtime{ subject }
    expect(time).to be < 1
  end


end