# frozen_string_literal: true

require 'rails_helper'

RSpec.shared_examples 'snapshots timeframe times of day' do |timeframe_key, custom_start, custom_end|
  let(:now) { DateTime.current.change(usec: 0) }

  before do
    allow(DateTime).to receive(:current).and_return(now)
  end

  let(:current_timeframe) do
    described_class.calculate_timeframes(timeframe_key, custom_start:, custom_end:)
  end
  let(:previous_timeframe) do
    described_class.calculate_timeframes(timeframe_key, custom_start:, custom_end:, previous_timeframe: true)
  end

  context "'#{timeframe_key}' current start" do
    it { expect(current_timeframe.first).to be_start_of_day }
  end
  context "'#{timeframe_key}' current end" do
    it { expect(current_timeframe.last).to be_end_of_day }
  end
  context "'#{timeframe_key}' previous start" do
    it { expect(previous_timeframe.first).to be_start_of_day }
  end
  context "'#{timeframe_key}' previous end" do
    it { expect(previous_timeframe.last).to be_end_of_day }
  end
end
