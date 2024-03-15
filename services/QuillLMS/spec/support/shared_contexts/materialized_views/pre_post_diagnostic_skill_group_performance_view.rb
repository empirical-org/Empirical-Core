# frozen_string_literal: true

RSpec.shared_context 'Pre Post Diagnostic Skill Group Performance View' do

  let(:post_diagnostic) { create(:diagnostic_activity, id: 1664) }
  let(:pre_diagnostic) { create(:diagnostic_activity, follow_up_activity: post_diagnostic, id: AdminDiagnosticReports::DiagnosticAggregateQuery::DIAGNOSTIC_ORDER_BY_ID.first) }
  let(:activities) { [pre_diagnostic, post_diagnostic].flatten }

  let(:pre_diagnostic_question) { create(:question) }
  let(:post_diagnostic_question) { create(:question) }
  let(:questions) { [pre_diagnostic_question, post_diagnostic_question].flatten }

  let(:skill_groups) { [create(:skill_group)] }

  let(:skill_group_activities) do
    activities.map do |activity|
      skill_groups.map do |skill_group|
        create(:skill_group_activity, activity:, skill_group:)
      end
    end
  end

  let(:diagnostic_question_skills) do
    questions.map.with_index do |question, i|
      create(:diagnostic_question_skill, question:, skill_group: skill_groups[i % skill_groups.length])
    end
  end

  let(:student_count) { 2 }
  let(:students) { create_list(:student, student_count) }

  let(:pre_diagnostic_assigned_students) { students }
  let(:post_diagnostic_assigned_students) { students }

  let(:classroom_unit_count) { 1 }

  let(:pre_diagnostic_units) { create_list(:unit, classroom_unit_count, activities: [pre_diagnostic]) }
  let(:post_diagnostic_units) { create_list(:unit, classroom_unit_count, activities: [post_diagnostic]) }
  let(:units) { [pre_diagnostic_units, post_diagnostic_units] }

  let(:pre_diagnostic_classroom_units) { pre_diagnostic_units.map { |unit| create(:classroom_unit, unit: unit, assigned_student_ids: pre_diagnostic_assigned_students.map(&:id)) } }
  let(:post_diagnostic_classroom_units) { pre_diagnostic_classroom_units.map.with_index { |classroom_unit, i| create(:classroom_unit, unit: post_diagnostic_units[i], classroom: classroom_unit.classroom, assigned_student_ids: post_diagnostic_assigned_students.map(&:id)) } }
  let(:classroom_units) { [pre_diagnostic_classroom_units, post_diagnostic_classroom_units].flatten }

  let(:classrooms) { classroom_units.map(&:classroom).uniq }

  let(:pre_diagnostic_unit_activities) { pre_diagnostic_units.map(&:unit_activities) }
  let(:post_diagnostic_unit_activities) { post_diagnostic_units.map(&:unit_activities) }
  let(:unit_activities) { [pre_diagnostic_unit_activities, post_diagnostic_unit_activities].flatten }

  let(:pre_diagnostic_activity_sessions) do
    pre_diagnostic_classroom_units.map do |classroom_unit|
      classroom_unit.assigned_student_ids.map do |user_id|
        create(:activity_session, :finished, classroom_unit:, user_id:, activity: pre_diagnostic)
      end
    end.flatten
  end
  let(:post_diagnostic_activity_sessions) { pre_diagnostic_activity_sessions.map { |pre_session| create(:activity_session, :finished, user: pre_session.user, activity: post_diagnostic, completed_at: pre_session.completed_at ? pre_session.completed_at + 1.hour : nil, classroom_unit: post_diagnostic_classroom_units[pre_diagnostic_classroom_units.index(pre_session.classroom_unit)]) } }
  let(:activity_sessions) { [pre_diagnostic_activity_sessions, post_diagnostic_activity_sessions].flatten }

  let(:pre_diagnostic_concept_results) { pre_diagnostic_activity_sessions.map.with_index { |activity_session, i| create(:concept_result, activity_session:, question_number: i + 1, extra_metadata: {question_uid: pre_diagnostic_question.uid}) } }
  let(:post_diagnostic_concept_results) { post_diagnostic_activity_sessions.map.with_index { |activity_session, i| create(:concept_result, activity_session:, question_number: i + 1, extra_metadata: {question_uid: post_diagnostic_question.uid}) } }
  let(:concept_results) { [pre_diagnostic_concept_results, post_diagnostic_concept_results].flatten }

  let(:view_records) do
    [
      activities,
      activity_sessions,
      classroom_units,
      concept_results,
      diagnostic_question_skills,
      questions,
      skill_groups,
      skill_group_activities,
      students,
      unit_activities,
      units
    ]
  end
end
