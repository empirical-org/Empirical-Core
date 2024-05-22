# frozen_string_literal: true

require 'rails_helper'

RSpec.shared_examples 'snapshots period query with a timeframe' do |timeframe_start, timeframe_end, expected_results|
  context "timeframe_start #{timeframe_start}, timeframe_end #{timeframe_end}" do
    let(:timeframe_start) { timeframe_start }
    let(:timeframe_end) { timeframe_end }

    it { expect(results).to eq expected_results }
  end
end

