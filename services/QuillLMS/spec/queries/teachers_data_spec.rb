# frozen_string_literal: true

require 'rails_helper'

describe 'TeachersData' do

  let!(:teachers_data_module) { TeachersData }

  let!(:classroom) { create(:classroom_with_a_couple_students) }
  let!(:teacher) { classroom.owner }
  let!(:school) { create(:school) }
  let!(:schools_user) {create(:schools_users, school: school, user: teacher) }

  let!(:teacher_ids) { [teacher.id] }
  let!(:unit) { create(:unit, user_id: teacher.id)}
  let!(:student1) { classroom.students.first }
  let!(:student2) { classroom.students.second }

  let!(:time2) { Time.current }
  let!(:time1) { time2 - (10.minutes) }

  let!(:classroom_unit) { create(:classroom_unit, classroom_id: classroom.id,
                                                        unit: unit)}
  let!(:activity_session1) { create(:activity_session_without_concept_results,
                                                user: student1,
                                                state: 'finished',
                                                started_at: time1,
                                                completed_at: time2,
                                                classroom_unit: classroom_unit
                                                ) }

  let!(:activity_session2) { create(:activity_session_without_concept_results,
                                                user: student1,
                                                state: 'finished',
                                                started_at: time1,
                                                completed_at: time2,
                                                classroom_unit: classroom_unit
                                                ) }

  let!(:concept1) { create(:concept) }
  let!(:concept2) { create(:concept) }

  before do
    @results = teachers_data_module.run(teacher_ids)
  end

  it 'school works' do
    expect(@results.first.school.name).to eq(school.name)
  end

  it 'number_of_students works' do
    expect(@results.first.number_of_students).to eq(2)
  end
end
