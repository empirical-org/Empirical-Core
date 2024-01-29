# frozen_string_literal: true

require 'rails_helper'

module AdminDiagnosticReports
  describe DiagnosticPerformanceBySkillQuery do
    include_context 'Admin Diagnostic Aggregate CTE'

    context 'big_query_snapshot', :big_query_snapshot do
      subject { results }

      let(:classrooms) { Array.new(num_classrooms) { |i| create(:classroom, grade: i + 1) } }
      let(:concept_results) do
        [
          pre_activity_sessions.map { |activity_session| concept_results_for_activity_session(activity_session, pre_questions, pre_correct_count) },
          post_activity_sessions.map { |activity_session| concept_results_for_activity_session(activity_session, post_questions, post_correct_count) }
        ]
      end
      let(:diagnostic_id) { pre_diagnostic.id }
      let(:query_args) do
        {
          timeframe_start: timeframe_start,
          timeframe_end: timeframe_end,
          school_ids: school_ids,
          grades: grades,
          teacher_ids: teacher_ids,
          classroom_ids: classroom_ids,
          aggregation: aggregation_arg,
          diagnostic_id: diagnostic_id
        }
      end
      # Some of our tests include activity_sessions having NULL in its timestamps so we need a version that has timestamps with datetime data in them so that WITH in the CTE understands the data type expected
      let(:reference_activity_session) { create(:activity_session, :finished) }
      let(:cte_records) do
        [
          classrooms,
          teachers,
          students,
          classrooms_teachers,
          schools,
          schools_users,
          classroom_units,
          pre_activity_sessions,
          post_activity_sessions,
          concept_results,
          pre_diagnostic,
          post_diagnostic,
          reference_activity_session,
          questions,
          diagnostic_question_skills,
          skill_group
        ]
      end
      let(:classroom_units) { classrooms.map { |classroom| create(:classroom_unit, classroom: classroom) } }
      let(:post_classroom_units) { classrooms.map { |classroom| create(:classroom_unit, classroom: classroom) } }
      let(:pre_activity_sessions) { classroom_units.map { |classroom_unit| create(:activity_session, :finished, classroom_unit: classroom_unit, activity: pre_diagnostic) } }
      let(:post_activity_sessions) { pre_activity_sessions.map { |pre_activity_session| create(:activity_session, :finished, classroom_unit: pre_activity_session.classroom_unit, activity: post_diagnostic, user: pre_activity_session.user, completed_at: pre_activity_session.completed_at + 1.day) } }
      let(:students) { pre_activity_sessions.map(&:user) }

      let(:skill_group) { create(:skill_group) }
      let(:pre_correct_count) { 5 }
      let(:pre_incorrect_count) { 5 }
      let(:pre_questions) { Array.new(pre_correct_count + pre_incorrect_count) { create(:question) } }
      let(:post_correct_count) { 10 }
      let(:post_incorrect_count) { 0 }
      let(:post_questions) { Array.new(post_correct_count + post_incorrect_count) { create(:question) } }
      let(:questions) { pre_questions + post_questions }
      let(:diagnostic_question_skills) { (questions).map{ |question| create(:diagnostic_question_skill, question: question, skill_group: skill_group) } }

      def concept_results_for_activity_session(activity_session, questions, correct_count)
        [
          Array.new(correct_count) { |i| create(:concept_result, activity_session: activity_session, question_number: i + 1, extra_metadata: {question_uid: questions[i].uid}, correct: true) },
          Array.new(questions.length - correct_count) { |i| create(:concept_result, activity_session: activity_session, question_number: i + 1 + correct_count, extra_metadata: {question_uid: questions[i + correct_count].uid}, correct: false) }
        ].flatten
      end






      context 'invalid diagnostic id' do
        let(:diagnostic_id) { 1 }

        it { expect{ subject }.to raise_error(DiagnosticPerformanceBySkillQuery::InvalidDiagnosticIdError) }
      end

      # Ideally we'd break this up into multiple cases, and also account for more varied inputs, but for some reason this query takes 15-ish seconds to run even with this dummy data, so writing a bunch of separate cases would balloon our run time.  Writing one super-case for now.
      # TODO: Come back and expand the test cases in this spec once they can be run in reasonable time
      it 'maximal results test' do
        result = results.first
        all_pre_concept_results = pre_activity_sessions.map(&:concept_results).flatten
        all_post_concept_results = post_activity_sessions.map(&:concept_results).flatten

        expect(result[:aggregate_rows].length).to eq(classrooms.map(&:grade).uniq.length)
        expect(result[:skill_name]).to eq(skill_group.name)
        expect(result[:pre_score]).to eq(all_pre_concept_results.select(&:correct).length.to_f / all_pre_concept_results.length * 100)
        expect(result[:post_score]).to eq(all_post_concept_results.select { |cr| cr.correct }.length.to_f / all_post_concept_results.length * 100)
        expect(result[:pre_correct_total]).to eq(all_pre_concept_results.select { |cr| cr.correct }.length)
        expect(result[:pre_total_questions]).to eq(all_pre_concept_results.length)
        expect(result[:post_correct_total]).to eq(all_post_concept_results.select { |cr| cr.correct }.length)
        expect(result[:post_total_questions]).to eq(all_post_concept_results.length)

        # The setup for these tests gives users 50% correct rates on their pre-diagnostic, and 100% correct rates on their post-diagnostic, which correspond to "improved proficiency"
        expect(result[:maintained_proficiency]).to eq(0)
        expect(result[:improved_proficiency]).to eq(post_activity_sessions.length)
        expect(result[:recommended_practice]).to eq(0)

        [:pre_correct_total, :pre_total_questions, :post_correct_total, :post_correct_total, :maintained_proficiency, :improved_proficiency, :recommended_practice].each do |column_name|
          expect(result[column_name]).to eq(result[:aggregate_rows].map { |row| row[column_name] }.sum)
        end
      end

      # TODO: Here's a list of edge cases we should consider covering once runtimes are reasonable
      # no completed activity_sessions
      # pre activity_sessions only
      ## count total questions
      ### with multiple attempts
      ## count total correct answers
      ### with multiple attempts
      # pre and post activity_sessions
      ## count total questions
      ### with multiple attempts
      ## count total correct answers
      ### with multiple attempts
      # pre and post activity sessions plus second pre
      # two sets of pre and post activity_sessions
      # score calculations
      ## pre activity_session only
      ## pre and post activity_sessions
      # proficiency gain logic
      ## pre activity_session only
      ## 0 score for pre
      ### partial score for post
      ### full score for post
      ## partial score for pre
      ### lower score for post
      ### equal score for post
      ### higher score for post
      ### max score for post
      ## max score for pre
      ### lower score for post
      ### same score for post
      ### higher score for post
      ### max score for pre

    end
  end
end
