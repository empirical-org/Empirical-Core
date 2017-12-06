require 'rails_helper'

describe ProgressReports::Concepts::ConceptSerializer, type: :serializer do
  let!(:classroom) { create(:classroom) }
  let(:teacher) { classroom.owner }
  let!(:student) { create(:user, role: 'student', classrooms: [classroom])}
  let(:activity) { create(:activity) }
  let(:classroom_activity) { create(:classroom_activity, classroom: classroom, activity: activity) }
  let(:concept_for_report) { ProgressReports::Concepts::Concept.results(teacher, {}).first }
  let(:concept) { create(:concept) }
  let(:serializer) { described_class.new(concept_for_report) }

  before do
    activity_session = student.activity_sessions.create!(
      classroom_activity: classroom_activity,
      percentage: 0.7547,
      state: 'finished',
      completed_at: 5.minutes.ago,
    )
    activity_session.concept_results.create!(concept: concept, metadata: {'correct' => 1})
    activity_session.concept_results.create!(concept: concept, metadata: {'correct' => 0})
  end

  describe '#to_json' do
    subject { JSON.parse(serializer.to_json) }
    let(:parsed_concept) { subject['concept'] }

    it 'includes the right keys' do
      expect(parsed_concept.keys)
        .to match_array %w(concept_id
                           concept_name
                           total_result_count
                           correct_result_count
                           incorrect_result_count
                           level_2_concept_name
                           percentage
                          )
    end

    it 'includes the percentage' do
      expect(parsed_concept['percentage']).to eq(50)
    end
  end
end
