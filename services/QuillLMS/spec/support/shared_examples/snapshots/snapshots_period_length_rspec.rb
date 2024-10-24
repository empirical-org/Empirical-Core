# frozen_string_literal: true

require 'rails_helper'

RSpec.shared_examples 'snapshots period length' do |timeframe_key, length, custom_start, custom_end|
  context "'#{timeframe_key}'" do
    let(:now) { DateTime.current }
    let(:timeframe) { described_class.calculate_timeframes(timeframe_key, custom_start:, custom_end:) }

    # Periods are from beginning of day to end of day,
    # so they are 1 second under the full amount, e.g. 29.999999999
    # rounding at 6 decimals to make comparison deterministic
    subject { (timeframe.last - timeframe.first).to_f.round(6) }

    it { expect(subject).to eq length }
  end
end
