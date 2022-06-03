# frozen_string_literal: true

require 'rails_helper'

describe ProgressReports::Standards::StudentSerializer, type: :serializer do
  let(:classroom) { create(:classroom_with_one_student) }
  let(:teacher) { classroom.owner }
  let(:student) {classroom.students.first}
  let(:activity) { create(:activity) }
  let(:classroom_unit) do
    create(:classroom_unit,
      classroom: classroom,
      assigned_student_ids: [student.id]
    )
  end
  let(:student_for_report) do
    ProgressReports::Standards::Student.new(teacher).results({}).first
  end

  let(:serializer) do
    serializer = described_class.new(student_for_report)
    serializer.classroom_id = 123
    serializer
  end

  describe '#to_json output' do
    let(:json)   { serializer.to_json }
    let(:parsed) { JSON.parse(json) }
    let(:parsed_student) { parsed['student'] }

    before do
      student.activity_sessions.create!(
        percentage: 0.7547,
        state: 'finished',
        completed_at: 5.minutes.ago,
        classroom_unit: classroom_unit,
        activity: activity
      )
    end

    it 'includes the right keys' do
      expect(parsed_student.keys).to match_array(
        [
          'name',
          'id',
          'sorting_name',
          'total_standard_count',
          'proficient_standard_count',
          'not_proficient_standard_count',
          'total_activity_count',
          'timespent',
          'average_score',
          'student_standards_href',
          'mastery_status'
        ]
      )
    end

    it 'includes properly rounded scores' do
      expect(parsed_student['average_score']).to eq(0.75)
    end

    it 'should not raise error when average_score is nil' do
      mock_object = double.tap { |mock| allow(mock).to receive(:average_score).and_return(nil) }
      serializer = described_class.new(mock_object)
      expect do
        serializer.average_score
      end.to_not raise_error
      expect(serializer.average_score).to eq 0
    end

  end
end
