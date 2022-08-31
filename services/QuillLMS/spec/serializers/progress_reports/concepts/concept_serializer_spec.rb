# frozen_string_literal: true

require 'rails_helper'

describe ProgressReports::Concepts::ConceptSerializer, type: :serializer do
  let!(:classroom) { create(:classroom) }
  let(:teacher) { classroom.owner }
  let!(:student) { create(:user, role: 'student', classrooms: [classroom])}
  let(:activity) { create(:activity) }
  let(:unit_activity) { create(:unit_activity, activity: activity) }
  let(:classroom_unit) do
    create(:classroom_unit,
      classroom: classroom,
      assigned_student_ids: [student.id]
    )
  end
  let(:concept_for_report) do
    ProgressReports::Concepts::Concept.results(teacher, {}).first
  end
  let(:concept) { create(:concept) }
  let(:serializer) { described_class.new(concept_for_report) }

  before do
    activity_session = student.activity_sessions.create!(
      activity: activity,
      percentage: 0.7547,
      state: 'finished',
      completed_at: 5.minutes.ago,
      classroom_unit: classroom_unit
    )
    activity_session.concept_results
      .create!(concept: concept, correct: true)
    activity_session.concept_results
      .create!(concept: concept, correct: false)
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
                           percentage)
    end

    it 'includes the percentage' do
      expect(parsed_concept['percentage']).to eq(50)
    end
  end
end
