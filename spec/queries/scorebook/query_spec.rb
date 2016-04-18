require 'rails_helper'

describe 'ScorebookQuery' do
  let!(:teacher) { FactoryGirl.create(:user, role: 'teacher') }
  let!(:classroom) { FactoryGirl.create(:classroom, teacher: teacher) }
  let!(:student) { FactoryGirl.create(:user, role: 'student', classrooms: [classroom]) }
  let!(:activity) { FactoryGirl.create(:activity) }
  let!(:classroom_activity) {FactoryGirl.create(:classroom_activity, classroom_id: classroom.id)}
  let!(:activity_session) { FactoryGirl.create(:activity_session,
                                                user: student,
                                                activity: activity,
                                                is_final_score: true,
                                                state: 'finished',
                                                classroom_activity_id: classroom_activity.id,
                                                completed_at: Time.now
                                                ) }

  let!(:scorebook_query) { Scorebook::Query.new(teacher) }

  def subject
    scorebook_query.query
  end

  it 'works' do
    all, is_last_page = subject
    expect(all).to_not be_empty
  end

end
