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
        'school_id' => QuillBigQuery::Transformer::LAMBDA_TO_F,
        'color' => QuillBigQuery::Transformer::LAMBDA_IDENTITY
      }
      expect(lookup).to include(expected)
    end
  end

  describe '#transform_pair' do
    it 'should apply the correct lambda, given a key' do
      transformer = QuillBigQuery::Transformer.new(example_fields, example_array_of_hashes)
      expect(transformer.transform_pair('school_id', '1')).to eq 1.0
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

  describe 'datetime proc' do
    # Many ISO 8601 date formats exist. Bigquery currently uses this one.
    let(:example_iso_8601_date_string) { "2022-05-06T17:08:44.915791" }

    it 'should should DATETIME values correctly' do
      result = QuillBigQuery::Transformer::LAMBDA_TO_DATETIME.call(example_iso_8601_date_string)
      expect(result.class).to eq DateTime
      expect([result.year, result.month, result.day]).to eq [2022, 5, 6]

    end
  end
end
