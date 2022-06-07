# frozen_string_literal: true

require 'rails_helper'

describe ProgressReports::Standards::AllClassroomsStandard do
  describe '#results' do
    let!(:standard1) { create(:standard) }
    let!(:teacher1) { create(:teacher, :with_classrooms_students_and_activities) }

    let!(:sample_student_data) do
      classroom_unit = ClassroomUnit.last
      {
        student: User.find(classroom_unit.assigned_student_ids.first),
        classroom_unit: classroom_unit
      }
    end

    let!(:activity_session1) do
      create(:activity_session, user: sample_student_data[:student], classroom_unit: sample_student_data[:classroom_unit])
    end

    it 'should return results' do
      expected_keys =  ["id", "name", "standard_level_name", "total_activity_count", "total_student_count", "proficient_count", "timespent"]
      result = ProgressReports::Standards::AllClassroomsStandard.new(teacher1)
      .results(sample_student_data[:classroom_unit].classroom_id, nil)
      expect(result.first.keys).to eq expected_keys
    end
  end

end
