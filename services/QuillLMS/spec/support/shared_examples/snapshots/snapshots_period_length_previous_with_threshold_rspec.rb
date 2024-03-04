# frozen_string_literal: true

require 'rails_helper'

RSpec.shared_examples 'snapshots period length, previous within threshold' do |timeframe_key, threshold, custom_start, custom_end|
  context "'#{timeframe_key}'" do
    let(:now) { DateTime.current }
    let(:timeframe) {described_class.calculate_timeframes(timeframe_key, custom_start:, custom_end:)}
    let(:previous_timeframe) {described_class.calculate_timeframes(timeframe_key, custom_start:, custom_end:, previous_timeframe: true)}

    # Periods are from beginning of day to end of day,
    # so they are 1 second under the full amount, e.g. 29.999999999
    # rounding at 6 decimals to make comparison deterministic
    let(:previous_timeframe_length) {(previous_timeframe.last - previous_timeframe.first).to_f.round(6)}
    let(:current_timeframe_length) {(timeframe.last - timeframe.first).to_f.round(6)}

    before do
      allow(DateTime).to receive(:current).and_return(now)
    end

    subject {(current_timeframe_length - previous_timeframe_length).abs}

    it { expect(subject).to be <= threshold }
  end
end
