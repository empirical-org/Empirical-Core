# frozen_string_literal: true

module Snapshots
  describe Timeframes do
    context '#frontend_options' do
      it do
        expect(described_class.frontend_options).to eq([
          {default: false, name: "Last 30 days", value: "last-30-days"},
          {default: false, name: "Last 90 days", value: "last-90-days"},
          {default: false, name: "This month", value: "this-month"},
          {default: false, name: "Last month", value: "last-month"},
          {default: true, name: "This school year", value: "this-school-year"},
          {default: false, name: "Last school year", value: "last-school-year"},
          {default: false, name: "All time", value: "all-time"},
          {default: false, name: "Custom", value: "custom"}
        ])
      end
    end

    context 'timeframe calculations' do
      # Replacing usec with 0 lets us avoid in-memory vs database timestamp comparisons which have different precisions
      let(:now) { DateTime.current.change(usec: 0) }
      let(:end_of_yesterday) { now.end_of_day - 1.day }

      before do
        allow(DateTime).to receive(:current).and_return(now)
      end

      it do
        expect(described_class.calculate_timeframes('last-30-days')).to eq([
          end_of_yesterday - 30.days,
          end_of_yesterday
        ])
      end

      it do
        expect(described_class.calculate_timeframes('last-30-days', previous_timeframe: true)).to eq([
          end_of_yesterday - 60.days,
          end_of_yesterday - 30.days
        ])
      end

      context 'previous timeframe calculations for "this month" and "this school year"' do
        let(:now) { DateTime.parse('2023-01-10') }

        it do
          expect(described_class.calculate_timeframes('this-month', previous_timeframe: true)).to eq([
            end_of_yesterday.beginning_of_month - 1.month,
            end_of_yesterday - 1.month
          ])
        end

        it do
          expect(described_class.calculate_timeframes('this-school-year', previous_timeframe: true)).to eq([
            School.school_year_start(end_of_yesterday) - 1.year,
            end_of_yesterday - 1.year
          ])
        end
      end

      context 'custom timeframe previous start and end calculations' do
        let(:custom_start) { now - 10.hours }
        let(:custom_end) { now - 30.minutes }

        it do
          expect(described_class.calculate_timeframes('custom', custom_start: custom_start.to_s, custom_end: custom_end.to_s, previous_timeframe: true)).to eq([
            (custom_start - (custom_end - custom_start)).beginning_of_day,
            custom_start.end_of_day
          ])
        end
      end
    end
  end
end
