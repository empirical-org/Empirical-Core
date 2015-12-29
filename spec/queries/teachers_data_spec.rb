require 'rails_helper'

describe 'TeachersData' do

  let!(:teacher) { FactoryGirl.create(:user, role: 'teacher') }
  let!(:teacher_ids) { [teacher.id] }
  let!(:classroom) { FactoryGirl.create(:classroom, teacher: teacher) }
  let!(:student1) { FactoryGirl.create(:user, role: 'student', classroom: classroom) }
  let!(:student2) { FactoryGirl.create(:user, role: 'student', classroom: classroom) }

  let!(:time1) { Time.now - (1.days + 2.hours) }
  let!(:time2) { Time.now }

  let!(:activity_session1) { FactoryGirl.create(:activity_session, user: student1, started_at: time1, completed_at: time2) }
  let!(:activity_session2) { FactoryGirl.create(:activity_session, user: student1, started_at: time1, completed_at: time2) }
  let!(:concept1) { FactoryGirl.create(:concept) }
  let!(:concept2) { FactoryGirl.create(:concept) }
  let!(:concept_result1) { FactoryGirl.create(:concept_result, concept: concept1, activity_session: activity_session1) }
  let!(:concept_result2) { FactoryGirl.create(:concept_result, concept: concept2, activity_session: activity_session2) }

  def subject
    TeachersData.run(teacher_ids).first
  end

  before :each do
    @result = subject
  end

  it 'numer_of_students works' do
    expect(@result.number_of_students).to eq(2)
  end

  it 'number_of_questions_completed works' do
    expect(@result.number_of_questions_completed).to eq(2)
  end

  it 'time_spent works' do
    expect(@result.time_spent).to eq(2*(time2 - time1))
  end

end