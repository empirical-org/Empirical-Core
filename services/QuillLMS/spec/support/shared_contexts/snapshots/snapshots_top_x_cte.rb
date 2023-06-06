# frozen_string_literal: true

RSpec.shared_context 'Snapshots TopX CTE' do
  include_context 'Snapshots Period CTE'

  # Intentionally empty.  Only defined because it's currently expected in the Snapshot inclusion stack.
  let(:cte_records) { [] }
end
