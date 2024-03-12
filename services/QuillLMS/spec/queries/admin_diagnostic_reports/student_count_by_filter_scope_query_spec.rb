# frozen_string_literal: true

require 'rails_helper'

module AdminDiagnosticReports
  describe StudentCountByFilterScopeQuery do
    include_context 'Admin Diagnostic Aggregate CTE'
    include_context 'Pre Post Diagnostic Skill Group Performance View'

    context 'big_query_snapshot', :big_query_snapshot do
      # Some of our tests include activity_sessions having NULL in its timestamps so we need a version that has timestamps with datetime data in them so that WITH in the CTE understands the data type expected
      let(:reference_activity_session) { create(:activity_session, :finished) }
      # Some of our tests expect no concept_results to exist, but BigQuery needs to know what one is shaped like in order to build temporary queries
      let(:reference_concept_results) { create(:concept_result, extra_metadata: {question_uid: SecureRandom.uuid}) }

      let(:query_args) do
        {
          timeframe_start: timeframe_start,
          timeframe_end: timeframe_end,
          school_ids: school_ids,
          grades: grades,
          teacher_ids: teacher_ids,
          classroom_ids: classroom_ids,
          diagnostic_id: pre_diagnostic.id
        }
      end

      let(:cte_records) do
        [
          classrooms,
          teachers,
          classrooms_teachers,
          schools,
          schools_users,
          view_records,
          reference_activity_session,
          reference_concept_results
        ]
      end

      let(:count) { results[:count] }

      context 'filter by school_ids only' do
        let(:grades) { nil }
        let(:teacher_ids) { nil }
        let(:classroom_ids) { nil }

        it { expect(count).to eq(students.count) }
      end

      context 'specified filters' do
        let(:student_in_filter) { create(:student) }
        let(:student_not_in_filter) { create(:student) }
        let(:students) { [student_in_filter, student_not_in_filter] }

        let(:classroom_unit_in_filter) { create(:classroom_unit, unit: pre_diagnostic_units.first, assigned_student_ids: [student_in_filter.id]) }
        let(:classroom_unit_not_in_filter) { create(:classroom_unit, unit: pre_diagnostic_units.first, assigned_student_ids: [student_not_in_filter.id]) }
        let(:pre_diagnostic_classroom_units) { [classroom_unit_in_filter, classroom_unit_not_in_filter] }

        context 'filter by grades' do
          let(:grades) { [classroom_unit_in_filter.classroom.grade] }

          it { expect(count).to eq(classroom_unit_in_filter.assigned_student_ids.length) }
        end
  
        context 'filter by teacher_ids' do
          let(:teacher_ids) { [classroom_unit_in_filter.classroom.teachers.first.id] }
  
          it { expect(count).to eq(classroom_unit_in_filter.assigned_student_ids.length) }
        end
  
        context 'filter by classroom_ids' do
          let(:classroom_ids) { [classroom_unit_in_filter.classroom.id] }
  
          it { expect(count).to eq(classroom_unit_in_filter.assigned_student_ids.length) }
        end
      end
    end
  end
end
