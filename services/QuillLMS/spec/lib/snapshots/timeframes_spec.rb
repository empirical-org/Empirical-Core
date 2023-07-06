# frozen_string_literal: true

module Snapshots
  describe Timeframes do
    context '#frontend_options' do
      it do
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
          end_of_yesterday - 60.days,
          end_of_yesterday - 30.days,
          end_of_yesterday - 30.days,
          end_of_yesterday
        ])
      end

      context 'previous timeframe calculations for "this month" and "this year"' do
        let(:now) { DateTime.parse('2023-01-10') }

        it do
          expect(described_class.calculate_timeframes('this-month')).to eq([
            end_of_yesterday.beginning_of_month - 1.month,
            end_of_yesterday - 1.month,
            end_of_yesterday.beginning_of_month,
            end_of_yesterday
          ])
        end

        it do
          expect(described_class.calculate_timeframes('this-year')).to eq([
            end_of_yesterday.beginning_of_year - 1.year,
            end_of_yesterday - 1.year,
            end_of_yesterday.beginning_of_year,
            end_of_yesterday
          ])
        end
      end

      context 'custom timeframe previous start and end calculations' do
        let(:custom_start) { now - 10.hours }
        let(:custom_end) { now - 30.minutes }

        it do
          expect(described_class.calculate_timeframes('custom', custom_start: custom_start.to_s, custom_end: custom_end.to_s)).to eq([
            custom_start - (custom_end - custom_start),
            custom_start,
            custom_start,
            custom_end
          ])
        end
      end
    end
  end
