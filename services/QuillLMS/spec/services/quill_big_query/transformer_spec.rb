# frozen_string_literal: true

require 'rails_helper'

describe QuillBigQuery::Transformer do
  let(:example_fields) do
    [
      {'name' => 'school_id', 'type' => 'INTEGER'},
      {'name' => 'color', 'type' => 'STRING'}
    ]
  end

  let(:example_array_of_hashes) do
    [
      {'school_id' => '1', 'color' => 'purple'},
      {'school_id' => '2', 'color' => 'green'}
    ]
  end

  describe '#build_field_to_lambda_lookup' do
    it 'should build a lookup' do
      lookup = QuillBigQuery::Transformer.build_field_to_lambda_lookup(example_fields)

      expected = {
        'school_id' => QuillBigQuery::Transformer::LAMBDA_TO_INT,
        'color' => QuillBigQuery::Transformer::LAMBDA_IDENTITY
      }
      expect(lookup).to include(expected)
    end

    context 'encountered type does not exist in lookup table' do
      it 'should default to using the identity function' do
        example_fields = [
          {'name' => 'foo', 'type' => 'NEW_TYPE'}
        ]

        lookup = QuillBigQuery::Transformer.build_field_to_lambda_lookup(example_fields)

        expected = {
          'foo' => QuillBigQuery::Transformer::LAMBDA_IDENTITY
        }
        expect(lookup).to include(expected)
      end
    end
  end

  describe '#transform_pair' do
    it 'should apply the correct lambda, given a key' do
      transformer = QuillBigQuery::Transformer.new(example_fields, example_array_of_hashes)
      expect(transformer.transform_pair('school_id', '1')).to eq 1.0
    end

    it 'should allow nil values to pass through' do
      transformer = QuillBigQuery::Transformer.new(example_fields, example_array_of_hashes)
      expect(transformer.transform_pair('school_id', nil)).to eq nil
    end
  end

  describe '#transform' do
    it 'should call transform_pair for each hash in array' do
      n = example_array_of_hashes.first.keys.length * example_array_of_hashes.length
      transformer = QuillBigQuery::Transformer.new(example_fields, example_array_of_hashes)
      expect(transformer).to receive(:transform_pair).exactly(n).times
      transformer.transform
    end

    it 'should transform FLOAT and INTEGER fields to ruby floats' do
      fields = [
        {'name' => 'a', 'type' => 'FLOAT'},
        {'name' => 'b', 'type' => 'INTEGER'},
        {'name' => 'c', 'type' => 'STRING'}
      ]
      input = [{ "a" => "1.0", "b" => "2", "c" => "3"}]
      expected_output = [{ "a" => 1.0, "b" => 2, "c" => "3"}]
      expect(QuillBigQuery::Transformer.new(fields, input).transform).to eq expected_output
    end
  end

  describe 'procs' do
    describe 'LAMBDA_TO_BOOLEAN' do
      it 'should transform BOOLEAN false values correctly' do
        result = QuillBigQuery::Transformer::LAMBDA_TO_BOOLEAN.call('false')
        expect(result.class).to eq FalseClass
      end

      it 'should transform BOOLEAN true values correctly' do
        result = QuillBigQuery::Transformer::LAMBDA_TO_BOOLEAN.call('true')
        expect(result.class).to eq TrueClass
      end
    end

    describe 'LAMBDA_TO_DATETIME' do
      # Many ISO 8601 date formats exist. Bigquery currently uses this one.
      let(:example_iso_8601_date_string) { "2022-05-06T17:08:44.915791" }

      it 'should transform DATETIME values correctly' do
        result = QuillBigQuery::Transformer::LAMBDA_TO_DATETIME.call(example_iso_8601_date_string)
        expect(result.class).to eq DateTime
        expect([result.year, result.month, result.day]).to eq [2022, 5, 6]

      end
    end

    describe 'LAMBDA_TO_F' do
      it 'should transform float values correctly' do
        result = QuillBigQuery::Transformer::LAMBDA_TO_F.call('1.0')
        expect(result).to eq 1.0
      end
    end

    describe 'LAMBDA_TO_INT' do
      it 'should transform float values correctly' do
        result = QuillBigQuery::Transformer::LAMBDA_TO_INT.call('1')
        expect(result).to eq 1
      end
    end

    describe 'LAMBDA_IDENTITY' do
      it 'should return the input' do
        result = QuillBigQuery::Transformer::LAMBDA_IDENTITY.call(1)
        expect(result).to eq 1

        result = QuillBigQuery::Transformer::LAMBDA_IDENTITY.call('a')
        expect(result).to eq 'a'
      end
    end

  end
end
