# frozen_string_literal: true

require 'rails_helper'

module AdminDiagnosticReports
  describe PostDiagnosticCompletedViewQuery do
    include_context 'Admin Diagnostic Aggregate CTE'
    include_context 'Pre Post Diagnostic Skill Group Performance View'

    context 'big_query_snapshot', :big_query_snapshot do
      # Some of our tests include activity_sessions having NULL in its timestamps so we need a version that has timestamps with datetime data in them so that WITH in the CTE understands the data type expected
      let(:reference_activity_session) { create(:activity_session, :finished) }

      let(:cte_records) do
        [
          classrooms,
          teachers,
          classrooms_teachers,
          schools,
          schools_users,
          view_records,
          reference_activity_session
        ]
      end

      it { expect(results.first[:diagnostic_name]).to eq(pre_diagnostic.name) }
      it { expect(results.first[:aggregate_rows].map { |row| row[:name] }).to match_array(grade_names) }
      it { expect(results.first[:post_students_completed]).to eq(post_diagnostic_activity_sessions.length) }
      it { expect(results.first[:overall_skill_growth]).to eq(0.0) }

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
        let(:post_diagnostic_activity_sessions) do
          pre_diagnostic_activity_sessions.map.with_index do |pre_session, i|
            # alternate between finished and unstarted sessions
            session_status = i.odd? ? :finished : :unstarted
            completed_at = i.odd? ? pre_session.completed_at + 1.hour : nil
            create(:activity_session, session_status, user: pre_session.user, activity: post_diagnostic, completed_at:, classroom_unit: post_diagnostic_classroom_units[pre_diagnostic_classroom_units.index(pre_session.classroom_unit)])
          end
        end

        it { expect(results.first[:post_students_completed]).to eq(post_diagnostic_activity_sessions.length / 2) }
      end

      context 'none correct to all correct' do
        let(:pre_diagnostic_concept_results) { pre_diagnostic_activity_sessions.map.with_index { |activity_session, i| create(:concept_result, activity_session:, correct: false, question_number: i + 1, extra_metadata: {question_uid: pre_diagnostic_question.uid}) } }

        it { expect(results.first[:overall_skill_growth]).to eq(1.0) }
      end

      context 'all correct to none correct' do
        let(:post_diagnostic_concept_results) { post_diagnostic_activity_sessions.map.with_index { |activity_session, i| create(:concept_result, activity_session:, correct: false, question_number: i + 1, extra_metadata: {question_uid: post_diagnostic_question.uid}) } }

        it { expect(results.first[:overall_skill_growth]).to eq(0.0) }
      end

      context 'optimal and non-optimal concept results for the same question number' do
        let(:pre_diagnostic_concept_results) { pre_diagnostic_activity_sessions.map.with_index { |activity_session, i| create(:concept_result, activity_session:, correct: false, question_number: i + 1, extra_metadata: {question_uid: pre_diagnostic_question.uid}) } }
        let(:post_diagnostic_concept_results) do
          post_diagnostic_activity_sessions.map.with_index do |activity_session, i|
            create(:concept_result, activity_session:, correct: false, question_number: i + 1, extra_metadata: {question_uid: post_diagnostic_question.uid})
            create(:concept_result, activity_session:, correct: true, question_number: i + 1, extra_metadata: {question_uid: post_diagnostic_question.uid})
          end
        end

        it { expect(results.first[:overall_skill_growth]).to eq(1.0) }
      end
    end
  end
end
