# frozen_string_literal: true

require 'rails_helper'

module AdminDiagnosticReports
  describe DiagnosticRecommendationsByStudentQuery do
    include_context 'Admin Diagnostic Aggregate CTE'

    context 'big_query_snapshot', :big_query_snapshot do
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

      let(:recommended_activity) { create(:activity) }
      let(:recommended_unit_template) { create(:unit_template, activities: [recommended_activity]) }
      let(:recommended_unit_templates) { [recommended_unit_template] }

      let(:units) { recommended_unit_templates.map { |ut| create(:unit, unit_template: ut) } }
      let(:recommendations) { recommended_unit_templates.map { |ut| create(:recommendation, activity: pre_diagnostic, unit_template: ut, category: 0) } }


      let(:recommended_classroom_units) do
        classrooms.map do |classroom|
          units.map { |unit| create(:classroom_unit, classroom: classroom, unit: unit) }
        end.flatten
      end

      let(:timespent) { 100 }

      let(:recommended_activity_sessions) { recommended_classroom_units.map { |classroom_unit| create(:activity_session, :finished, classroom_unit: classroom_unit, activity: recommended_activity, timespent: timespent) } }

      let(:students) { recommended_activity_sessions.map(&:user) }
      let(:grade_names) { classrooms.map(&:grade).uniq.map { |g| g.to_i > 0 ? "Grade #{g}" : g } }

      # Some of our tests include activity_sessions having NULL in its timestamps so we need a version that has timestamps with datetime data in them so that WITH in the CTE understands the data type expected
      let(:reference_activity_session) { create(:activity_session, :finished) }

      let(:cte_records) do
        [
          classrooms,
          teachers,
          classrooms_teachers,
          schools,
          schools_users,
          recommended_classroom_units,
          pre_diagnostic,
          recommended_activity,
          recommended_unit_templates,
          units,
          recommendations,
          recommended_activity_sessions,
          students,
          reference_activity_session
        ]
      end

      it { expect(results.length).to eq(students.length) }
      it { expect(results.values.map{|v| v[:time_spent_seconds]}.sum).to eq(recommended_activity_sessions.map(&:timespent).sum) }
      it { expect(results.values.map{|v| v[:completed_activities]}.sum).to eq(recommended_activity_sessions.length) }

      context 'no recommendations assigned' do
        let(:recommended_activity_sessions) { [] }

        it { expect(results).to eq({}) }
      end

      context 'recommendations assigned but not completed' do
        let(:recommended_activity_sessions) { recommended_classroom_units.map { |classroom_unit| create(:activity_session, :unstarted, classroom_unit: classroom_unit, activity: recommended_activity, timespent: timespent) } }

        it { expect(results).to eq({}) }
      end

      context 'no visible activity sessions' do
        let(:recommended_activity_sessions) { recommended_classroom_units.map { |classroom_unit| create(:activity_session, :finished, classroom_unit: classroom_unit, activity: recommended_activity, visible: false) } }

        it { expect(results).to eq({}) }
      end

      context 'a mix of completed and incomplete recommendations' do
        let(:complete_activity_sessions) { [create(:activity_session, :finished, classroom_unit: recommended_classroom_units.first, activity: recommended_activity, timespent: timespent)] }
        let(:incomplete_activity_sessions) { [create(:activity_session, :unstarted, classroom_unit: recommended_classroom_units.first, activity: recommended_activity, timespent: timespent)] }
        let(:recommended_activity_sessions) { [complete_activity_sessions, incomplete_activity_sessions].flatten }

        let(:expected_students_completed) { complete_activity_sessions.map(&:user_id).uniq.length }

        it { expect(results.length).to eq(expected_students_completed) }
      end

      context 'one student with many recommendations' do
        let(:time_spent_results) { [10, 20, 30, 40, 50] }
        let(:student) { create(:student) }
        let(:students) { [student] }
        let(:recommended_activity_sessions) { time_spent_results.map { |timespent| create(:activity_session, :finished, classroom_unit: recommended_classroom_units.first, activity: recommended_activity, timespent: timespent, user: student) } }

        it { expect(results.length).to eq(students.length) }
        it { expect(results.values.map{|v| v[:completed_activities]}.sum).to eq(recommended_activity_sessions.length) }
      end
    end
  end
end
