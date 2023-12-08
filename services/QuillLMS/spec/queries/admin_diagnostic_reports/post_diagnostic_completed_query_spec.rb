# frozen_string_literal: true

require 'rails_helper'

module AdminDiagnosticReports
  describe PostDiagnosticCompletedQuery do
    include_context 'Admin Diagnostic Aggregate CTE'

    context 'big_query_snapshot', :big_query_snapshot do
      let(:classroom_units) { classrooms.map { |classroom| create(:classroom_unit, classroom: classroom) } }
      let(:activity_sessions) { classroom_units.map { |classroom_unit| create(:activity_session, :finished, classroom_unit: classroom_unit, activity: post_diagnostic) } }
      let(:optimal_concept_results) { activity_sessions.map.with_index { |activity_session, i| create(:concept_result, activity_session: activity_session, question_number: i + 1) } }
      let(:concept_results) { optimal_concept_results }

      # Some of our tests include activity_sessions having NULL in its timestamps so we need a version that has timestamps with datetime data in them so that WITH in the CTE understands the data type expected
      let(:reference_activity_session) { create(:activity_session, :finished) }

      let(:cte_records) do
        [
          classrooms,
          teachers,
          classrooms_teachers,
          schools,
          schools_users,
          classroom_units,
          activity_sessions,
          concept_results,
          post_diagnostic,
          pre_diagnostic,
          reference_activity_session
        ]
      end

      it { expect(results.first[:diagnostic_name]).to eq(pre_diagnostic.name) }
      it { expect(results.first[:aggregate_rows].map { |row| row[:name] }).to match_array(grade_names) }
      it { expect(results.first[:post_students_completed]).to eq(activity_sessions.length) }
      it { expect(results.first[:post_average_score]).to eq(1.0) }

      context 'no finished activity sessions' do
        let(:activity_sessions) { classroom_units.map { |classroom_unit| create(:activity_session, :unstarted, classroom_unit: classroom_unit, activity: post_diagnostic) } }

        it { expect(results).to eq([]) }
      end

      context 'finished activity session from a user who is no longer assigned to the classroom unit' do
        # The ActivitySession factory aggressively attaches students to ClassroomUnit.assigned_student_ids, so it's easier to manually remove them than to try to override a `let` call for this condition
        before do
          # Make sure all factories run so that the change we make below doesn't get overwritten
          cte_records
          classroom_units.each { |cu| cu.update(assigned_student_ids: []) }
        end

        it { expect(results).to eq([]) }
      end

      context 'a mix of finished and unfinished activity sessions' do
        let(:unfinished_activity_session) { create(:activity_session, :unstarted, classroom_unit: classroom_units.first, activity: post_diagnostic) }
        let(:finished_activity_session) { create(:activity_session, :finished, classroom_unit: classroom_units.last, activity: post_diagnostic) }
        let(:activity_sessions) { [unfinished_activity_session, finished_activity_session] }

        it { expect(results.first[:post_students_completed]).to eq(1) }
      end

      context 'all concept results are non-optimal' do
        let(:concept_results) { activity_sessions.map.with_index { |activity_session, i| create(:concept_result, activity_session: activity_session, correct: false, question_number: i + 1) } }

        it { expect(results.first[:post_average_score]).to eq(0) }
      end

      context 'a mix of optimal and non-optimal concept results' do
        let(:non_optimal_concept_results) { activity_sessions.map.with_index { |activity_session, i| create(:concept_result, activity_session: activity_session, correct: false, question_number: optimal_concept_results.length + i + 1) } }
        let(:concept_results) { optimal_concept_results + non_optimal_concept_results }

        it { expect(results.first[:post_average_score]).to eq(0.5) }
      end

      context 'optimal and non-optimal concept results for the same question number' do
        let(:non_optimal_concept_results) { optimal_concept_results.map { |cr| create(:concept_result, activity_session: cr.activity_session, correct: false, question_number: cr.question_number) } }
        let(:concept_results) { optimal_concept_results + non_optimal_concept_results }

        it { expect(results.first[:post_average_score]).to eq(1.0) }
      end
    end
  end
end
