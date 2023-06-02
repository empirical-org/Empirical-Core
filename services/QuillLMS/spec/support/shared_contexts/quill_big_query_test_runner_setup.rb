# frozen_string_literal: true

RSpec.shared_context 'QuillBigQuery TestRunner Setup' do
  # Create before running the query, otherwise, some parameters (e.g. school_ids) will be nil
  before { cte_records }

  let(:runner) { QuillBigQuery::TestRunner.new(cte_records) }
  let(:results) {described_class.run(*params, runner: runner) }
end
