require 'rails_helper'

describe ProgressReports::Standards::TopicSerializer, type: :serializer do
  let(:teacher) { FactoryGirl.create(:teacher) }
  let!(:student) { FactoryGirl.create(:student, teacher: teacher)}
  let!(:classroom) { FactoryGirl.create(:classroom, teacher: teacher) }
  let!(:topic) { FactoryGirl.create(:topic) }
  let(:activity) { FactoryGirl.create(:activity, topic: topic) }
  let(:classroom_activity) { FactoryGirl.create(:classroom_activity, classroom: classroom, activity: activity) }
  let(:topic_for_report) { Topic.for_standards_report(teacher, {}).first }
  let(:serializer) do
    serializer = described_class.new(topic_for_report)
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
    let(:parsed_topic) { parsed['topic'] }

    it 'includes the right keys' do
      expect(parsed_topic.keys)
        .to match_array %w(name
                           id
                           section_name
                           total_student_count
                           proficient_student_count
                           near_proficient_student_count
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
