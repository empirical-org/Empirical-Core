require 'rails_helper'

describe ProgressReports::Standards::ClassroomSerializer, type: :serializer do
  let!(:classroom) { create(:classroom_with_one_student) }
  let(:student) { classroom.students.first }
  let(:teacher) { classroom.owner }
  let(:activity) { create(:activity) }
  let(:classroom_unit) do
    create(:classroom_unit,
      classroom: classroom,
      assigned_student_ids: [student.id]
    )
  end
  let(:classroom_for_report) do
    ProgressReports::Standards::Classroom.new(teacher).results({}).first
  end
  let(:serializer) { described_class.new(classroom_for_report) }

  before do
    student.activity_sessions.create!(
      classroom_unit: classroom_unit,
      percentage: 1,
      state: 'finished',
      completed_at: 5.minutes.ago,
      activity: activity
    )
  end

  describe '#to_json output' do
    let(:json)   { serializer.to_json }
    let(:parsed) { JSON.parse(json) }
    let(:parsed_classroom) { parsed['classroom'] }

    it 'includes the right keys' do
      expect(parsed_classroom.keys)
        .to match_array %w(name
                           total_student_count
                           proficient_student_count
                           not_proficient_student_count
                           total_standard_count
                           students_href
                           standards_href)
    end
  end
end
