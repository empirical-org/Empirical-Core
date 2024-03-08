# frozen_string_literal: true

RSpec.shared_context 'Pre Post Diagnostic Skill Group Performance View' do

  let(:post_diagnostic) { create(:diagnostic_activity) }
  let(:pre_diagnostic) { create(:diagnostic_activity, follow_up_activity: post_diagnostic, id: AdminDiagnosticReports::DiagnosticAggregateQuery::DIAGNOSTIC_ORDER_BY_ID.first) }
  let(:activities) { [pre_diagnostic, post_diagnostic].flatten }

  let(:pre_diagnostic_question) { create(:question) }
  let(:post_diagnostic_question) { create(:question) }
  let(:questions) { [pre_diagnostic_question, post_diagnostic_question].flatten }

  let(:skill_group_count) { 2 }
  let(:skill_groups) { create_list(:skill_group, skill_group_count) }

  let(:skill_group_activities) do
    activities.map do |activity|
      skill_groups.map do |skill_group|
        create(:skill_group_activity, activity:, skill_group:)
      end
    end
  end

  let(:diagnostic_question_skills) do
    questions.map.with_index do |question, i|
      create(:diagnostic_question_skill, question:, skill_group: skill_groups[i % skill_group_count])
    end
  end

  let(:classroom_unit_count) { 2 }
  let(:pre_diagnostic_classroom_units) { create_list(:classroom_unit, classroom_unit_count) }
  let(:post_diagnostic_classroom_units) { create_list(:classroom_unit, classroom_unit_count) }
  let(:classroom_units) { [pre_diagnostic_classroom_units, post_diagnostic_classroom_units].flatten }

  let(:pre_diagnostic_unit_activities) { pre_diagnostic_classroom_units.map { |classroom_unit| create(:unit_activity, unit: classroom_unit.unit, activity: pre_diagnostic) } }
  let(:post_diagnostic_unit_activities) { post_diagnostic_classroom_units.map { |classroom_unit| create(:unit_activity, unit: classroom_unit.unit, activity: post_diagnostic) } }
  let(:unit_activities) { [pre_diagnostic_unit_activities, post_diagnostic_unit_activities].flatten }

  let(:pre_diagnostic_activity_sessions) { pre_diagnostic_classroom_units.map { |classroom_unit| create(:activity_session, :finished, classroom_unit:, activity: pre_diagnostic) } }
  let(:post_diagnostic_activity_sessions) { post_diagnostic_classroom_units.map { |classroom_unit| create(:activity_session, :finished, classroom_unit:, activity: post_diagnostic) } }
  let(:activity_sessions) { [pre_diagnostic_activity_sessions, post_diagnostic_activity_sessions].flatten }

  let(:pre_diagnostic_concept_results) { pre_diagnostic_activity_sessions.map.with_index { |activity_session, i| create(:concept_result, activity_session:, question_number: i + 1, extra_metadata: {question_uid: pre_diagnostic_question.uid}) } }
  let(:post_diagnostic_concept_results) { post_diagnostic_activity_sessions.map.with_index { |activity_session, i| create(:concept_result, activity_session:, question_number: i + 1, extra_metadata: {question_uid: post_diagnostic_question.uid}) } }
  let(:concept_results) { [pre_diagnostic_concept_results, post_diagnostic_concept_results].flatten }

  let(:view_records) do
    [
      activities,
      questions,
      skill_groups,
      skill_group_activities,
      diagnostic_question_skills,
      classroom_units,
      unit_activities,
      activity_sessions,
      concept_results
    ]
  end
end
