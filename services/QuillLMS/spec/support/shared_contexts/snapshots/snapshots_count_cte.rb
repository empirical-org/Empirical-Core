# frozen_string_literal: true

RSpec.shared_context 'Snapshots Count CTE' do
  include_context 'Snapshots Period CTE'

  let(:classroom_units) { classrooms.map { |classroom| create(:classroom_unit, classroom: classroom) } }
  let(:classroom_units_cte_query) { cte_query(classroom_units) }

  let(:activity_sessions) { classroom_units.map { |classroom_unit| create(:activity_session, classroom_unit: classroom_unit) } }
  let(:activity_sessions_cte_query) { cte_query(activity_sessions) }

  let(:concept_results) { activity_sessions.map { |activity_session| create(:concept_result, activity_session: activity_session) } }
  let(:concept_results_cte_query)  { cte_query(concept_results) }

  let(:snapshots_count_cte) do
    <<-SQL
      #{snapshots_period_cte},
      classroom_units AS ( #{classroom_units_cte_query} ),
      activity_sessions AS ( #{activity_sessions_cte_query} )
    SQL
  end

  let(:cte) { snapshots_count_cte }
end
