# frozen_string_literal: true

RSpec.shared_context 'Snapshots Count CTE' do
  include_context 'Snapshots Period CTE'

  let(:classroom_units) { classrooms.map { |classroom| create(:classroom_unit, classroom: classroom) } }

  let(:activity_sessions) do
    classroom_units.map do |classroom_unit|
      create(:activity_session, classroom_unit: classroom_unit, timespent: rand(1..100))
    end
  end

  let(:count_query_cte_table_collections) { period_query_cte_table_collections << classroom_units << activity_sessions }
  let(:cte_table_collections) { count_query_cte_table_collections }
end
