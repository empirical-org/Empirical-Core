# frozen_string_literal: true

require 'rails_helper'

module AdminDiagnosticReports
  describe AssembleStudentsReport do
    subject { described_class.run(payload) }

    let(:payload) { { example: 'payload' } }
    let(:student_id) { 1 }

    let(:performance_result) do
      {
         student_id:,
         student_name: 'Test Student',
         pre_activity_session_completed_at: '2023-11-14T17:51:00.600+00:00',
         post_activity_session_completed_at: nil,
         classroom_id: 1,
         aggregate_id: nil,
         name: 'ROLLUP',
         group_by: 'student',
         skill_group_name: 'ROLLUP',
         pre_to_post_improved_skill_count: 0,
         pre_questions_correct: 21,
         pre_questions_total: 23,
         pre_questions_percentage: 0.7666666666666666,
         post_questions_correct: nil,
         post_questions_total: nil,
         post_questions_percentage: nil,
         total_skills: 5,
         pre_skills_proficient: 3,
         pre_skills_to_practice: 2,
         post_skills_to_practice: 0,
         post_skills_improved: 0,
         post_skills_maintained: 0,
         post_skills_improved_or_maintained: 0,
         aggregate_rows: [
           {
             student_id:,
             student_name: 'Test Student',
             pre_activity_session_completed_at: '2023-11-14T17:51:00.600+00:00',
             post_activity_session_completed_at: nil,
             classroom_id: 1,
             aggregate_id: '1:1',
             name: 'Test Student',
             group_by: 'student',
             skill_group_name: 'ELL-Specific Skills',
             pre_to_post_improved_skill_count: 0,
             pre_questions_correct: 6,
             pre_questions_total: 6,
             pre_questions_percentage: 1.0,
             post_questions_correct: nil,
             post_questions_total: nil,
             post_questions_percentage: nil,
             total_skills: 1,
             pre_skills_proficient: 1,
             pre_skills_to_practice: 0,
             post_skills_to_practice: 0,
             post_skills_improved: 0,
             post_skills_maintained: 0,
             post_skills_improved_or_maintained: 0
          }
         ]
      }
    end
    let(:performance_results) { [performance_result] }

    let(:recommendations_result) do
      {
        completed_activities: 6,
        time_spent_seconds: 1485
      }
    end
    let(:recommendations_results) { { student_id => recommendations_result } }

    before do
      allow(AdminDiagnosticReports::DiagnosticPerformanceByStudentViewQuery).to receive(:run).with(**payload).and_return(performance_results)
      allow(AdminDiagnosticReports::DiagnosticRecommendationsByStudentQuery).to receive(:run).with(**payload).and_return(recommendations_results)
    end

    it { expect(subject.length).to eq(performance_results.length) }
    it { expect(subject.first).to include(performance_result).and include(recommendations_result) }

    context 'no completed recommendations' do
      let(:recommendations_results) { {} }

      it { expect(subject.first.keys).to include(:completed_activities, :time_spent_seconds) }
      it { expect(subject.first[:completed_activities]).to be(nil) }
      it { expect(subject.first[:time_spent_seconds]).to be(nil) }
    end
  end
end
