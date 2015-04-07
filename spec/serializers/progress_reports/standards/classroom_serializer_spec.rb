require 'rails_helper'

describe ProgressReports::Standards::ClassroomSerializer, type: :serializer do
  let(:teacher) { FactoryGirl.create(:teacher) }
  let!(:classroom) { FactoryGirl.create(:classroom_with_one_student, teacher: teacher) }
  let(:activity) { FactoryGirl.create(:activity) }
  let(:classroom_activity) { FactoryGirl.create(:classroom_activity, classroom: classroom, activity: activity) }
  let(:classroom_for_report) { Classroom.for_standards_report(teacher, {}).first }
  let(:serializer) { described_class.new(classroom_for_report) }

  before do
    classroom.students.first.activity_sessions.create!(
      classroom_activity: classroom_activity,
      percentage: 1,
      state: 'finished',
      completed_at: 5.minutes.ago
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
                           near_proficient_student_count
                           not_proficient_student_count
                           total_standard_count
                           students_href
                           topics_href
                          )
    end
  end
end
