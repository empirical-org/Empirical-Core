# frozen_string_literal: true

require 'rails_helper'

RSpec.describe PreviousYearTeacherDatum, type: :model do

  context '#calculate_data' do
    let!(:year) { 2016 }
    let!(:teacher) { create(:user, role: 'teacher') }
    let!(:active_classroom) { create(:classroom, created_at: Date.new(year,10,1), visible: true) }
    let!(:archived_classroom) { create(:classroom, created_at: Date.new(year,10,1), visible: false)}
    let!(:current_classroom) { create(:classroom, created_at: Date.new(2021, 10, 1))}
    let!(:student1) { create(:user, role: 'student')}
    let!(:student2) { create(:user, role: 'student')}
    let!(:student3) { create(:user, role: 'student')}
    let!(:student4) { create(:user, role: 'student')}
    let!(:unit) { create(:unit, user_id: teacher.id) }
    let!(:unit3) { create(:unit, user_id: teacher.id)}
    let!(:unit2) { create(:unit, user_id: teacher.id) }
    let!(:unit4) { create(:unit, user_id: teacher.id)}
    let!(:classroom_unit1) { create(:classroom_unit, classroom: active_classroom, unit: unit, created_at: Date.new(year, 10, 1), assigned_student_ids: [student1.id, student2.id])}
    let!(:classroom_unit2) { create(:classroom_unit, classroom: archived_classroom, unit: unit3, created_at: Date.new(year, 10, 1), assigned_student_ids: [student4.id])}
    let!(:classroom_unit3) { create(:classroom_unit, classroom: current_classroom, unit: unit2, created_at: Date.new(2021, 10, 1), assigned_student_ids: [student3.id])}
    let!(:classroom_unit4) { create(:classroom_unit, classroom: current_classroom, unit: unit4, created_at: Date.new(year, 10, 1), assigned_student_ids: [student4.id])}
    let!(:diagnostic) { create(:diagnostic_activity)}
    let!(:connect) { create(:connect_activity)}
    let!(:evidence) { create(:evidence_activity)}
    let!(:unit_activity) { create(:unit_activity, unit: unit, activity: diagnostic, created_at: Date.new(year, 10, 1)) }
    let!(:unit_activity2) { create(:unit_activity, unit: unit2, activity: diagnostic, created_at: Date.new(2021, 10, 1)) }
    let!(:unit_activity3) { create(:unit_activity, unit: unit3, activity: connect, created_at: Date.new(year, 10, 1)) }
    let!(:unit_activity4) { create(:unit_activity, unit: unit4, activity: evidence, created_at: Date.new(year, 10, 1)) }

    before do
      create(:classrooms_teacher, user: teacher, classroom: active_classroom)
      create(:classrooms_teacher, user: teacher, classroom: archived_classroom)
      create(:classrooms_teacher, user: teacher, classroom: current_classroom)
      create(:students_classrooms, student: student3, classroom: current_classroom)
      create(:students_classrooms, student: student4, classroom: archived_classroom)
      create(:activity_session,
        user: student1,
        classroom_unit: classroom_unit1,
        activity: diagnostic,
        state: 'finished',
        completed_at: Date.new(year, 10, 2)
      )
      create(:activity_session,
        user: student1,
        classroom_unit: classroom_unit1,
        state: 'finished',
        activity: diagnostic,
        completed_at: Date.new(year, 10, 2)
      )
      create(:activity_session,
        user: student2,
        classroom_unit: classroom_unit1,
        state: 'started',
        activity: diagnostic,
        completed_at: Date.new(year, 10, 2)
      )
      create(:activity_session,
        user: student4,
        classroom_unit: classroom_unit2,
        state: 'finished',
        completed_at: Date.new(year, 10, 2)
      )
      create(:activity_session,
        user: student4,
        classroom_unit: classroom_unit4,
        state: 'finished',
        activity: evidence,
        completed_at: Date.new(year, 10, 2)
      )
      create(:activity_session,
        user: student3,
        classroom_unit: classroom_unit3,
        state: 'finished',
        completed_at: Date.new(2021, 10, 2)
      )
    end

    it 'should raise error if the year is the current year' do
      expect { PreviousYearTeacherDatum.new(teacher, Time.current.year).calculate_data }.to raise_error("Cannot calculate data for a school year that is still ongoing.")
    end

    it 'should calculate all data' do
      expected_data = {
        total_students: 3,
        active_students: 2,
        activities_assigned: 4,
        completed_activities: 4,
        completed_activities_per_student: 2.0,
        completed_evidence_activities_per_student: 0.5,
        percent_completed_activities: 1.0,
        diagnostics_assigned: 2,
        diagnostics_finished: 2,
        evidence_activities_assigned: 1,
        evidence_activities_completed: 1,
        percent_completed_diagnostics: 1.0
      }
      teacher_data = PreviousYearTeacherDatum.new(teacher, year).calculate_data
      expect(teacher_data).to eq(expected_data)
    end
  end
end
