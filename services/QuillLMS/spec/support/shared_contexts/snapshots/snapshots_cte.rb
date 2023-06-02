# frozen_string_literal: true

RSpec.shared_context 'Snapshots CTE' do
  # Create before running the query, otherwise, some parameters (e.g. school_ids) will be nil
  before { cte_records }

  let(:results) { QuillBigQuery::TestRunner.run(described_class.new(*params).final_query, cte_records) }
end
