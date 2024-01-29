require 'rails_helper'

RSpec.shared_examples 'snapshots timeframe times of day' do |timeframe_key|
  RSpec::Matchers.define :be_start_of_day do
    match do |actual|
      actual&.hour == 0 && actual&.minute == 0 && actual&.second == 0
    end
  end

  RSpec::Matchers.define :be_end_of_day do
    match do |actual|
      actual&.hour == 23 && actual&.minute == 59 && actual&.second == 59
    end
  end

  let(:now) { DateTime.current.change(usec: 0) }

  before do
    allow(DateTime).to receive(:current).and_return(now)
  end

  let(:current_timeframe) { described_class.calculate_timeframes(timeframe_key) }
  let(:previous_timeframe) { described_class.calculate_timeframes(timeframe_key, previous_timeframe: true) }

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
