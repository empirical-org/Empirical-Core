# frozen_string_literal: true

RSpec.shared_context 'QuillBigQuery TestRunner Setup' do
  let(:runner) { QuillBigQuery::TestRunner.new(cte_records) }
  let(:results) {described_class.run(*query_args, options: {runner: runner}) }
end
