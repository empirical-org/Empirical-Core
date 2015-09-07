require 'rails_helper'

describe ProgressReports::Concepts::StudentSerializer, type: :serializer do
  let(:teacher) { FactoryGirl.create(:teacher) }
  let!(:student) { FactoryGirl.create(:student, teacher: teacher)}
  let!(:classroom) { FactoryGirl.create(:classroom, teacher: teacher) }
  let(:activity) { FactoryGirl.create(:activity) }
  let(:classroom_activity) { FactoryGirl.create(:classroom_activity, classroom: classroom, activity: activity) }
  let(:student_for_report) { ProgressReports::Concepts::User.results(teacher, {}).first }
  let(:concept) { FactoryGirl.create(:concept) }
  let(:serializer) { described_class.new(student_for_report) }

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
    let(:parsed_student) { subject['student'] }

    it 'includes the right keys' do
      expect(parsed_student.keys)
        .to match_array %w(name
                           concepts_href
                           total_result_count
                           correct_result_count
                           incorrect_result_count
                           percentage
                          )
    end

    it 'includes the percentage' do
      expect(parsed_student['percentage']).to eq(50)
    end
  end
end
