require 'rails_helper'

describe 'ScorebookQuery' do
  let!(:teacher) { FactoryGirl.create(:user, role: 'teacher') }
  let!(:classroom) { FactoryGirl.create(:classroom, teacher: teacher) }
  let!(:student) { FactoryGirl.create(:user, role: 'student', classcode: classroom.code) }
  let!(:activity) { FactoryGirl.create(:activity) }
  let!(:activity_session) { FactoryGirl.create(:activity_session, user: student, activity: activity) }

  let!(:scorebook_query) { ScorebookQuery.new(teacher) }

  def subject
    scorebook_query.query
  end

  it 'works' do
    all, is_last_page = subject
    expect(all).to_not be_empty
  end

end