# frozen_string_literal: true

require 'rails_helper'

module AdminDiagnosticReports
  describe PreDiagnosticCompletedViewQuery do
    include_context 'Admin Diagnostic Aggregate CTE'
    include_context 'Pre Post Diagnostic Skill Group Performance View'

    context 'big_query_snapshot', :big_query_snapshot do
      # Some of our tests include activity_sessions having NULL in its timestamps so we need a version that has timestamps with datetime data in them so that WITH in the CTE understands the data type expected
      let(:reference_activity_session) { create(:activity_session, :finished) }
      let(:reference_concept_result) { create(:concept_result, activity_session: reference_activity_session, extra_metadata: {question_uid: SecureRandom.uuid}) }

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
          pre_diagnostic,
          reference_activity_session,
          reference_concept_result,
          view_records
        ]
      end

      it { expect(results.first[:diagnostic_name]).to eq(pre_diagnostic.name) }
      it { expect(results.first[:aggregate_rows].map { |row| row[:name] }).to match_array(grade_names) }
      it { expect(results.first[:pre_students_completed]).to eq(pre_diagnostic_activity_sessions.length) }
      it { expect(results.first[:pre_average_score]).to eq(1.0) }

      context 'no finished activity sessions' do
        let(:pre_diagnostic_activity_sessions) do
          pre_diagnostic_classroom_units.map do |classroom_unit|
            classroom_unit.assigned_student_ids.map do |user_id|
              create(:activity_session, :unstarted, classroom_unit:, user_id:, activity: pre_diagnostic)
            end
          end.flatten
        end

        it { expect(results).to eq([]) }
      end

      context 'no visible activity sessions' do
        let(:pre_diagnostic_activity_sessions) do
          pre_diagnostic_classroom_units.map do |classroom_unit|
            classroom_unit.assigned_student_ids.map do |user_id|
              create(:activity_session, :finished, classroom_unit:, user_id:, activity: pre_diagnostic, visible: false)
            end
          end.flatten
        end

        it { expect(results).to eq([]) }
      end

      context 'a mix of finished and unfinished activity sessions' do
        let(:pre_diagnostic_activity_sessions) do
          pre_diagnostic_classroom_units.map do |classroom_unit|
            classroom_unit.assigned_student_ids.map do |user_id|
              [
                create(:activity_session, :finished, classroom_unit:, user_id:, activity: pre_diagnostic),
                create(:activity_session, :unstarted, classroom_unit:, user_id:, activity: pre_diagnostic)
              ]
            end
          end.flatten
        end

        it { expect(results.first[:pre_students_completed]).to eq(pre_diagnostic_assigned_students.length) }
      end

      context 'all concept results are non-optimal' do
        let(:pre_diagnostic_concept_results) { pre_diagnostic_activity_sessions.map.with_index { |activity_session, i| create(:concept_result, activity_session:, question_number: i + 1, correct: false, extra_metadata: {question_uid: pre_diagnostic_question.uid}) } }

        it { expect(results.first[:pre_average_score]).to eq(0) }
      end

      context 'a mix of optimal and non-optimal concept results' do
        let(:pre_diagnostic_concept_results) { pre_diagnostic_activity_sessions.map.with_index { |activity_session, i| create(:concept_result, activity_session:, question_number: i + 1, correct: i.even?, extra_metadata: {question_uid: pre_diagnostic_question.uid}) } }

        it { expect(results.first[:pre_average_score]).to eq(0.5) }
      end

      context 'optimal and non-optimal concept results for the same question number' do
        let(:pre_diagnostic_concept_results) do
          pre_diagnostic_activity_sessions.map.with_index do |activity_session, i|
            [
              create(:concept_result, activity_session:, question_number: i + 1, correct: true, extra_metadata: {question_uid: pre_diagnostic_question.uid}),
              create(:concept_result, activity_session:, question_number: i + 1, correct: false, extra_metadata: {question_uid: pre_diagnostic_question.uid})
            ]
          end
        end

        it { expect(results.first[:pre_average_score]).to eq(1.0) }
      end
    end
  end
end
