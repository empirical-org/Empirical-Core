require 'rails_helper'

describe ProgressReports::Standards::TopicSerializer, type: :serializer do
  let!(:classroom) { create(:classroom_with_a_couple_students) }
  let!(:teacher) { classroom.owner }
  let!(:student) { classroom.students.first }
  let!(:topic) { create(:topic) }
  let(:activity) { create(:activity, topic: topic) }
  let(:classroom_unit) do
    create(:classroom_unit,
      classroom: classroom,
      assigned_student_ids: [student.id]
    )
  end
  let(:topic_for_report) do
    ProgressReports::Standards::Topic.new(teacher).results({}).first
  end
  let(:serializer) do
    serializer = described_class.new(topic_for_report)
    serializer.classroom_id = 123
    serializer
  end

  before do
    student.activity_sessions.create!(
      percentage: 0.7547,
      state: 'finished',
      completed_at: 5.minutes.ago,
      classroom_unit: classroom_unit,
      activity: activity
    )
  end

  describe '#to_json output' do
    let(:json)   { serializer.to_json }
    let(:parsed) { JSON.parse(json) }
    let(:parsed_topic) { parsed['topic'] }

    it 'includes the right keys' do
      expect(parsed_topic.keys)
        .to match_array %w(name
                           id
                           section_name
                           total_student_count
                           proficient_student_count
                           not_proficient_student_count
                           total_activity_count
                           average_score
                           topic_students_href
                           mastery_status
                          )
    end

    it 'includes properly rounded scores' do
      expect(parsed_topic['average_score']).to eq(0.75)
    end
  end
end
