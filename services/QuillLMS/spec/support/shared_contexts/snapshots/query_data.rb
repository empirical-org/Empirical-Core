# frozen_string_literal: true

RSpec.shared_context 'Snapshot Query Params' do
  let(:timeframe_start) { '2023-01-01' }
  let(:timeframe_end) { '2023-05-01' }
  let(:school_ids) { [32628] }
  let(:grades) { [9, 10, 11, 12] }
end
