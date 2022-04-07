# frozen_string_literal: true

require 'rails_helper'

describe TimeTrackingCleaner do
  let(:empty_data) { ({}) }
  let(:data_without_time_tracking) { ({'other_key' => 'other_value'}) }

  let(:data_without_outliers) do
    {
      'time_tracking' => {
        'so' => 1,
        'but' => 2,
        'because' => 3
      }
    }
  end

  let(:data_with_outliers) do
    {
      'time_tracking' => {
        'so' => 9999999,
        'but' => 10,
        'because' => 9
      }
    }
  end

  let(:modified_data) do
    {
      'time_tracking' => {
        'so' => 10,
        'but' => 10,
        'because' => 9
      },
      'time_tracking_edits' => {
        'so' => 9999999
      }
    }
  end

  let(:data_with_multiple_outliers) do
    {
      'time_tracking' => {
        'since' => 99999,
        'so' => 9999999,
        'henceforth' => 10,
        'but' => 10,
        'because' => 9
      }
    }
  end

  let(:modified_data_multiple) do
    {
      'time_tracking' => {
        'since' => 10,
        'so' => 10,
        'henceforth' => 10,
        'but' => 10,
        'because' => 9
      },
      'time_tracking_edits' => {
        'since' => 99999,
        'so' => 9999999,
      }
    }
  end

  describe '#clean' do
    it 'should return nil if passed nil' do
      expect(TimeTrackingCleaner.run(nil)).to be_nil
    end

    it 'should not modify an empty hash' do
      expect(TimeTrackingCleaner.run(empty_data)).to eq({})
    end

    it 'should not modify an a hash without time_tracking' do
      expect(TimeTrackingCleaner.run(data_without_time_tracking)).to eq(data_without_time_tracking)
    end

    it 'should not modify a hash with no outliers' do
      expect(TimeTrackingCleaner.run(data_without_outliers)).to eq(data_without_outliers)
    end

    it 'should modify a hash with outliers and record the edits' do
      expect(TimeTrackingCleaner.run(data_with_outliers)).to eq(modified_data)
    end

    it 'should modify a hash with mulitple outliers and record the edits' do
      expect(TimeTrackingCleaner.run(data_with_multiple_outliers)).to eq(modified_data_multiple)
    end
  end
end
