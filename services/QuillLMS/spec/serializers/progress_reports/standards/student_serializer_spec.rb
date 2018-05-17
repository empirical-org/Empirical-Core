require 'rails_helper'

describe ProgressReports::Standards::StudentSerializer, type: :serializer do
  let!(:classroom) { create(:classroom_with_one_student) }
  let(:teacher) { classroom.owner }
  let!(:student) {classroom.students.first}
  let(:activity) { create(:activity) }
  let(:classroom_activity) { create(:classroom_activity, classroom: classroom, activity: activity) }
  let(:student_for_report) { ProgressReports::Standards::Student.new(teacher).results({}).first }
  let(:serializer) do
    serializer = described_class.new(student_for_report)
    serializer.classroom_id = 123
    serializer
  end

  before do
    student.activity_sessions.create!(
      classroom_activity: classroom_activity,
      percentage: 0.7547,
      state: 'finished',
      completed_at: 5.minutes.ago
    )
  end

  describe '#to_json output' do
    let(:json)   { serializer.to_json }
    let(:parsed) { JSON.parse(json) }
    let(:parsed_student) { parsed['student'] }

    it 'includes the right keys' do
      expect(parsed_student.keys)
        .to match_array %w(name
                           id
                           sorting_name
                           total_standard_count
                           proficient_standard_count
                           not_proficient_standard_count
                           total_activity_count
                           average_score
                           student_topics_href
                           mastery_status
                          )
    end

    it 'includes properly rounded scores' do
      expect(parsed_student['average_score']).to eq(0.75)
    end
  end
end
