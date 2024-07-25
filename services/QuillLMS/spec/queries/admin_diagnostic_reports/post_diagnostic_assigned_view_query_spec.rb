# frozen_string_literal: true

require 'rails_helper'

module AdminDiagnosticReports
  describe PostDiagnosticAssignedViewQuery do
    include_context 'Admin Diagnostic Aggregate CTE'
    include_context 'Pre Post Diagnostic Skill Group Performance View'

    context 'big_query_snapshot', :big_query_snapshot do
      # Some of our tests include activity_sessions having NULL in its timestamps so we need a version that has timestamps with datetime data in them so that WITH in the CTE understands the data type expected
      let(:reference_activity_session) { create(:activity_session, :finished) }
      let(:reference_concept_result) { create(:concept_result, activity_session: reference_activity_session, extra_metadata: { question_uid: SecureRandom.uuid }) }
      let(:reference_diagnostic_question_optimal_concept) { create(:diagnostic_question_optimal_concept) }

      let(:cte_records) do
        [
          classrooms,
          teachers,
          classrooms_teachers,
          schools,
          schools_users,
          reference_activity_session,
          reference_concept_result,
          reference_diagnostic_question_optimal_concept,
          view_records
        ]
      end

      it { expect(results.first[:diagnostic_name]).to eq(pre_diagnostic.name) }
      it { expect(results.first[:aggregate_rows].map { |row| row[:name] }).to match_array(grade_names) }
      it { expect(results.first[:post_students_assigned]).to eq(students.length) }

      context 'student assigned to multiple instances of the same diagnostic in different classrooms' do
        let(:classroom_count) { 2 }

        it { expect(results.first[:post_students_assigned]).to eq(students.length * 2) }
      end

      context 'student assigned to multiple instances of the same diagnostics in the same classroom' do
        let(:units_per_classroom) { 2 }

        it { expect(results.first[:post_students_assigned]).to eq(students.length) }
      end

      context 'no relevant classroom_units' do
        # create a classroom unit not attached to relevant activities
        let(:classroom_units) { [create(:classroom_unit)] }

        it { expect(results).to eq([]) }
      end

      context 'no students assigned to classroom_unit' do
        let(:pre_diagnostic_assigned_students) { [] }
        let(:post_diagnostic_assigned_students) { [] }

        it { expect(results).to eq([]) }
      end
    end
  end
end
