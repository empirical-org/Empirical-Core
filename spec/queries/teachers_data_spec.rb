require 'rails_helper'

describe 'TeachersData' do

  let!(:teachers_data_module) { TeachersData }

  let!(:teacher) { FactoryBot.create(:user, role: 'teacher') }
  let!(:teacher_ids) { [teacher.id] }
  let!(:classroom) { FactoryBot.create(:classroom, teacher: teacher) }
  let!(:student1) { FactoryBot.create(:user, role: 'student', classrooms: [classroom]) }
  let!(:student2) { FactoryBot.create(:user, role: 'student', classrooms: [classroom]) }

  let!(:time2) { Time.now }
  let!(:time1) { time2 - (10.minutes) }
  let!(:default_time_spent) { teachers_data_module::AVERAGE_TIME_SPENT }


  let!(:activity_session1) { FactoryBot.create(:activity_session,
                                                user: student1,
                                                state: 'finished',
                                                started_at: time1,
                                                completed_at: time2) }

  let!(:activity_session2) { FactoryBot.create(:activity_session,
                                                user: student1,
                                                state: 'finished',
                                                started_at: time1,
                                                completed_at: time2) }

  let!(:concept1) { FactoryBot.create(:concept) }
  let!(:concept2) { FactoryBot.create(:concept) }
  let!(:concept_result1) { FactoryBot.create(:concept_result, concept: concept1, activity_session: activity_session1) }
  let!(:concept_result2) { FactoryBot.create(:concept_result, concept: concept2, activity_session: activity_session2) }

  def subject
    teachers_data_module.run(teacher_ids).first
  end

  before :each do
    @result = subject
  end

  it 'number_of_students works' do
    expect(@result.number_of_students).to eq(2)
  end

  it 'number_of_questions_completed works' do
    expect(@result.number_of_questions_completed).to eq(2)
  end

  it 'time_spent works' do
    expect(@result.time_spent).to eq(2*(time2 - time1))
  end

  context 'time spent on activities is less than 1 minute' do

    let!(:time1) { time2 - 2.seconds }

    it 'uses default_time_spent instead' do
      expect(@result.time_spent).to eq(2*default_time_spent)
    end
  end

  context 'time spent on activities is greater than 30 minutes' do

    let!(:time1) { time2 - 2.days}

    it 'uses default_time_spent instead' do
      expect(@result.time_spent).to eq(2*default_time_spent)
    end
  end

end