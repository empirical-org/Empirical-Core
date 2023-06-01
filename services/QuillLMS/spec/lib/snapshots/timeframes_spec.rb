# frozen_string_literal: true

module Snapshots
  describe Timeframes do
    it 'returns the expected frontend_options' do
      expect(described_class.frontend_options).to eq([
        {default: true, name: "Last 30 days", value: "last-30-days"},
        {default: false, name: "Last 90 days", value: "last-90-days"},
        {default: false, name: "This month", value: "this-month"},
        {default: false, name: "Last month", value: "last-month"},
        {default: false, name: "This year", value: "this-year"},
        {default: false, name: "Last year", value: "last-year"},
        {default: false, name: "All time", value: "all-time"},
        {default: false, name: "Custom", value: "custom"}
      ])
    end

    it 'accurately calculates a 30-day timeframe' do
      timeframe_value = 'last-30-days'
      now = DateTime.current
      end_of_yesterday = now.end_of_day - 1.day
      allow(DateTime).to receive(:current).and_return(now)

      expect(described_class.calculate_timeframes(timeframe_value, nil, nil)).to eq([
        end_of_yesterday - 60.days,
        end_of_yesterday - 30.days,
        end_of_yesterday
      ])
    end

    it 'accurately calculates a custom timeframe previous_start value' do
      now = DateTime.current.change(usec: 0) # strip fractional seconds to simplify conversion between string and DateTime
      custom_start = now - 10.hours
      custom_end = now - 30.minutes
      timeframe_length = custom_end - custom_start

      expect(described_class.calculate_timeframes('custom', custom_start.to_s, custom_end.to_s)).to eq([
        custom_start - timeframe_length,
        custom_start,
        custom_end
      ])
    end
  end
end
