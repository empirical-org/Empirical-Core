# frozen_string_literal: true

RSpec.shared_context 'Admin Diagnostic Aggregate CTE' do
  include_context 'Snapshots Period CTE'

  let(:aggregation_arg) { 'grade' }
  let(:query_args) do
    {
      timeframe_start: timeframe_start,
      timeframe_end: timeframe_end,
      school_ids: school_ids,
      grades: grades,
      teacher_ids: teacher_ids,
      classroom_ids: classroom_ids,
      aggregation: aggregation_arg
    }
  end

  let(:post_diagnostic) { create(:diagnostic_activity) }
  let(:pre_diagnostic) { create(:diagnostic_activity, follow_up_activity: post_diagnostic, id: AdminDiagnosticReports::DiagnosticAggregateQuery::DIAGNOSTIC_ORDER_BY_ID.first) }
  let(:grade_names) { classrooms.map(&:grade).uniq.map { |g| g.to_i > 0 ? "Grade #{g}" : g } }
end
