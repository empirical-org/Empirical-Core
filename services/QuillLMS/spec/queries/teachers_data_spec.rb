# frozen_string_literal: true

require 'rails_helper'

describe 'TeachersData' do

  let!(:teachers_data_module) { TeachersData }

  let!(:classroom) { create(:classroom_with_a_couple_students) }
  let!(:teacher) { classroom.owner }
  let!(:teacher_ids) { [teacher.id] }
  let!(:unit) { create(:unit, user_id: teacher.id)}
  let!(:student1) { classroom.students.first }
  let!(:student2) { classroom.students.second }

  let!(:time2) { Time.now }
  let!(:time1) { time2 - (10.minutes) }
  let!(:default_time_spent) { teachers_data_module::AVERAGE_TIME_SPENT }

  let!(:classroom_unit) { create(:classroom_unit, classroom_id: classroom.id,
                                                        unit: unit)}
  let!(:activity_session1) { create(:activity_session,
                                                user: student1,
                                                state: 'finished',
                                                started_at: time1,
                                                completed_at: time2,
                                                classroom_unit: classroom_unit
                                                ) }

  let!(:activity_session2) { create(:activity_session,
                                                user: student1,
                                                state: 'finished',
                                                started_at: time1,
                                                completed_at: time2,
                                                classroom_unit: classroom_unit
                                                ) }

  let!(:concept1) { create(:concept) }
  let!(:concept2) { create(:concept) }
  let!(:concept_result1) { create(:concept_result, concept: concept1, activity_session: activity_session1) }
  let!(:concept_result2) { create(:concept_result, concept: concept2, activity_session: activity_session2) }

  before :each do
    @result = teachers_data_module.run(teacher_ids).first
  end

  it 'number_of_students works' do
    expect(@result.number_of_students).to eq(2)
  end

  it 'number_of_questions_completed works' do
    expect(@result.number_of_questions_completed).to eq(4)
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
