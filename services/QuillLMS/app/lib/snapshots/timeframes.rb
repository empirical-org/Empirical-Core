# frozen_string_literal: true

module Snapshots
  class Timeframes
    DEFAULT_TIMEFRAME = 'last-30-days'

    TIMEFRAMES = [
      {
        value: 'last-30-days',
        name: 'Last 30 days',
        previous_start: proc { |reference_time| reference_time - 60.days },
        current_start: proc { |reference_time| reference_time - 30.days },
        current_end: proc { |reference_time| reference_time }
      }, {
        value: 'last-90-days',
        name: 'Last 90 days',
        previous_start: proc { |reference_time| reference_time - 180.days },
        current_start: proc { |reference_time| reference_time - 90.days },
        current_end: proc { |reference_time| reference_time },
      }, {
        value: 'this-month',
        name: 'This month',
        previous_start: proc { |reference_time| reference_time.beginning_of_month - (reference_time - reference_time.beginning_of_month) },
        current_start: proc { |reference_time| reference_time.beginning_of_month },
        current_end: proc { |reference_time| reference_time },
      }, {
        value: 'last-month',
        name: 'Last month',
        previous_start: proc { |reference_time| reference_time.beginning_of_month - 2.months },
        current_start: proc { |reference_time| reference_time.beginning_of_month - 1.month },
        current_end: proc { |reference_time| reference_time.beginning_of_month },
      }, {
        value: 'this-year',
        name: 'This year',
        previous_start: proc { |reference_time| reference_time.beginning_of_year - (reference_time - reference_time.beginning_of_year) },
        current_start: proc { |reference_time| reference_time.beginning_of_year },
        current_end: proc { |reference_time| reference_time },
      }, {
        value: 'last-year',
        name: 'Last year',
        previous_start: proc { |reference_time| reference_time.beginning_of_year - 2.years },
        current_start: proc { |reference_time| reference_time.beginning_of_year - 1.year },
        current_end: proc { |reference_time| reference_time.beginning_of_year },
      }, {
        value: 'all-time',
        name: 'All time',
        previous_start: proc { }, # A nil previous start passed to the worker results in the previous-period query being skipped
        current_start: proc { DateTime.new(2010,1,1) }, # This is well before any data exists in our system, so works for "all time"
        current_end: proc { |reference_time| reference_time },
      }, {
        value: 'custom',
        name: 'Custom',
        previous_start: proc { |_, custom_start, custom_end| DateTime.parse(custom_start) - (DateTime.parse(custom_end) - DateTime.parse(custom_start)) },
        current_start: proc { |_, custom_start| DateTime.parse(custom_start) },
        current_end: proc { |_, _, custom_end| DateTime.parse(custom_end) }
      }
    ]

    def self.find_timeframe(timeframe_value)
      TIMEFRAMES.find { |timeframe| timeframe[:value] == timeframe_value }
    end

    def self.calculate_timeframes(timeframe_value, custom_start, custom_end)
      timeframe = find_timeframe(timeframe_value)

      end_of_yesterday = DateTime.current.end_of_day - 1.day

      [
        timeframe[:previous_start].call(end_of_yesterday, custom_start, custom_end),
        timeframe[:current_start].call(end_of_yesterday, custom_start, custom_end),
        timeframe[:current_end].call(end_of_yesterday, custom_start, custom_end)
      ]
    end

    def self.frontend_options
      TIMEFRAMES.map do |timeframe|
        {
          value: timeframe[:value],
          name: timeframe[:name],
          default: (DEFAULT_TIMEFRAME == timeframe[:value])
        }
      end
    end
  end
end
