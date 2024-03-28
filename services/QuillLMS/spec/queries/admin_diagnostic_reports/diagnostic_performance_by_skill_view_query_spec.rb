# frozen_string_literal: true

require 'rails_helper'

module AdminDiagnosticReports
  describe DiagnosticPerformanceBySkillViewQuery do
    include_context 'Admin Diagnostic Aggregate CTE'
    include_context 'Pre Post Diagnostic Skill Group Performance View'

    context 'big_query_snapshot', :big_query_snapshot do
      subject { results }

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
          classrooms_teachers,
          schools,
          schools_users,
          reference_activity_session,
          view_records
        ]
      end

      # Ideally we'd break this up into multiple cases, and also account for more varied inputs, but for some reason this query takes 15-ish seconds to run even with this dummy data, so writing a bunch of separate cases would balloon our run time.  Writing one super-case for now.
      # TODO: Come back and expand the test cases in this spec once they can be run in reasonable time
      it 'maximal results test' do
        result = results.first

        expect(result[:aggregate_rows].length).to eq(classrooms.map(&:grade).uniq.length)

        expect(result[:skill_group_name]).to eq(skill_groups.first.name)
        expect(result[:group_by]).to eq(aggregation_arg)
        expect(result[:name]).to eq('ROLLUP')
        expect(result[:aggregate_rows].first[:aggregate_id]).to eq(available_grades.first)

        pre_score = pre_diagnostic_concept_results.select(&:correct).length.to_f / pre_diagnostic_concept_results.length
        expect(result[:pre_score]).to eq(pre_score)

        post_score = post_diagnostic_concept_results.select { |cr| cr.correct }.length.to_f / post_diagnostic_concept_results.length
        expect(result[:post_score]).to eq(post_score)

        expect(result[:growth_percentage]).to eq(post_score - pre_score)

        pre_diagnostic_activity_sessions_with_post = pre_diagnostic_activity_sessions.select { |pre| post_diagnostic_activity_sessions.map(&:user_id).include?(pre.user_id) }
        expect(result[:pre_score_completed_post]).to eq(pre_diagnostic_activity_sessions_with_post.map(&:concept_results).flatten.select(&:correct).length.to_f / pre_diagnostic_activity_sessions.map(&:concept_results).flatten.length)
        expect(result[:pre_students_completed]).to eq(students.length)
        expect(result[:post_students_completed]).to eq(students.length)

        # The setup for these tests gives users 100% correct rates on their pre-diagnostic, and 100% correct rates on their post-diagnostic, which correspond to "maintained proficiency"
        expect(result[:maintained_proficiency]).to eq(post_diagnostic_activity_sessions.length)
        expect(result[:improved_proficiency]).to eq(0)
        expect(result[:recommended_practice]).to eq(0)

        [:pre_students_completed, :post_students_completed, :maintained_proficiency, :improved_proficiency, :recommended_practice].each do |column_name|
          expect(result[column_name]).to eq(result[:aggregate_rows].map { |row| row[column_name] }.sum)
        end
        [:pre_score, :post_score, :pre_score_completed_post, :growth_percentage].each do |column_name|
          expect(result[column_name]).to eq(result[:aggregate_rows].map { |row| row[column_name] }.sum / result[:aggregate_rows].length)
        end
      end

    # TODO: A specific case that's not currently written up that we need to address is when a teacher has two different Diagnostics in the same ClassroomUnit.  We want to make sure that the data doesn't get contaminated with over-eager joins in this case
    #  # TODO: Here's a list of edge cases we should consider covering once runtimes are reasonable
    #  # no completed activity_sessions
    #  # pre activity_sessions only
    #  ## count total questions
    #  ### with multiple attempts
    #  ## count total correct answers
    #  ### with multiple attempts
    #  # pre and post activity_sessions
    #  ## count total questions
    #  ### with multiple attempts
    #  ## count total correct answers
    #  ### with multiple attempts
    #  # pre and post activity sessions plus second pre
    #  # two sets of pre and post activity_sessions
    #  # score calculations
    #  ## pre activity_session only
    #  ## pre and post activity_sessions
    #  # growth percentage logic
    #  ## pre activity_session only
    #  ## 0 score for pre
    #  ### partial score for post
    #  ### full score for post
    #  ## partial score for pre
    #  ### lower score for post
    #  ### equal score for post
    #  ### higher score for post
    #  ### max score for post
    #  ## max score for pre
    #  ### lower score for post
    #  ### same score for post
    #  ### higher score for post
    #  ### max score for pre

    end
  end
end
