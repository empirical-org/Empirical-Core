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
        'because' => 9,
        'passage' => 8
      },
      'other_key' => 1
    }
  end

  let(:modified_data) do
    {
      'time_tracking' => {
        'so' => 9,
        'but' => 10,
        'because' => 9,
        'passage' => 8
      },
      'other_key' => 1,
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

  let(:data_with_existing_edits) do
    {
      'time_tracking' => {
        'so' => 10,
        'but' => 999999,
        'because' => 9
      },
      'time_tracking_edits' => {
        'so' => 9999999
      }
    }
  end

  let(:modified_data_with_existing_edits) do
    {
      'time_tracking' => {
        'so' => 10,
        'but' => 10,
        'because' => 9
      },
      'time_tracking_edits' => {
        'so' => 9999999,
        'but' => 999999,
      }
    }
  end

  let(:data_with_existing_edits_no_outliers) do
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

    it 'should modify a hash with outliers and record the edits, while not touching other keys' do
      expect(TimeTrackingCleaner.run(data_with_outliers)).to eq(modified_data)
    end

    it 'should modify a hash with mulitple outliers and record the edits' do
      expect(TimeTrackingCleaner.run(data_with_multiple_outliers)).to eq(modified_data_multiple)
    end

    it 'should modify a hash with existing edits and preserve previous edits' do
      expect(TimeTrackingCleaner.run(data_with_existing_edits)).to eq(modified_data_with_existing_edits)
    end

    it 'should not modify hash with existing edits no outliers' do
      expect(TimeTrackingCleaner.run(data_with_existing_edits_no_outliers)).to eq(data_with_existing_edits_no_outliers)
    end

    context 'ignored keys' do
      let(:proofreader_data_no_outlier) do
        {
          'time_tracking'=> {
          'landing'=>4,
           'prompt_1'=>60,
           'prompt_2'=>65,
           'prompt_3'=>25,
           'prompt_4'=>23,
           'prompt_5'=>17,
           'prompt_6'=>42,
           'proofreading_the_passage'=>176
         }
        }
      end

      let(:proofreader_data_with_outlier) do
        {
          'time_tracking'=> {
          'landing'=>4,
           'prompt_1'=>60,
           'prompt_2'=>65,
           'prompt_3'=>9999999,
           'prompt_4'=>23,
           'prompt_5'=>17,
           'prompt_6'=>42,
           'proofreading_the_passage'=>176
         }
        }
      end

      let(:modified_proofreader_data_with_outlier) do
        {
          'time_tracking'=> {
          'landing'=>4,
           'prompt_1'=>60,
           'prompt_2'=>65,
           'prompt_3'=>51,
           'prompt_4'=>23,
           'prompt_5'=>17,
           'prompt_6'=>42,
           'proofreading_the_passage'=>176
          },
          'time_tracking_edits' => {
            'prompt_3'=>9999999
          }
        }
      end

      let(:proofreader_data_with_outlier_passage) do
        {
          'time_tracking'=> {
          'landing'=>4,
           'prompt_1'=>60,
           'prompt_2'=>65,
           'prompt_3'=>9999999,
           'prompt_4'=>23,
           'prompt_5'=>17,
           'prompt_6'=>42,
           'proofreading_the_passage'=>99999
         }
        }
      end

      let(:modified_proofreader_data_with_outlier_passage) do
        {
          'time_tracking'=> {
          'landing'=>4,
           'prompt_1'=>60,
           'prompt_2'=>65,
           'prompt_3'=>51,
           'prompt_4'=>23,
           'prompt_5'=>17,
           'prompt_6'=>42,
           'proofreading_the_passage'=>600
         },
          'time_tracking_edits' => {
            'prompt_3'=>9999999,
            'proofreading_the_passage'=>99999
          }
        }
      end

      it 'should not modify IGNORE_KEY data without outliers' do
        expect(TimeTrackingCleaner.run(proofreader_data_no_outlier)).to eq(proofreader_data_no_outlier)
      end

      it 'should modify outliers that isnt in IGNORE_KEY' do
        expect(TimeTrackingCleaner.run(proofreader_data_with_outlier)).to eq(modified_proofreader_data_with_outlier)
      end

      it 'should modify outliers that isnt in IGNORE_KEY, and ignore outlier in IGNORE_KEY' do
        expect(TimeTrackingCleaner.run(proofreader_data_with_outlier_passage)).to eq(modified_proofreader_data_with_outlier_passage)
      end
    end

  end

  describe '#median_value' do
    let(:time_tracking) { {'time_tracking' => {'a'=>1,'b'=> 2}} }

    it 'should round median to integer' do
      expect(TimeTrackingCleaner.new(time_tracking).send(:median_value)).to eq(1)
    end
  end
end
