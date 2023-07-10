# frozen_string_literal: true

require 'rails_helper'

describe QuillBigQuery::PreTransformer do
  describe '#build_array_query_params' do
    it 'throws an EmptyArrayParameterError error if the array is empty' do
      expect { QuillBigQuery::PreTransformer.build_array_query_params({parameters: []}) }.to raise_error(QuillBigQuery::PreTransformer::EmptyArrayParameterError)
    end

    it 'returns the properly formatted payload for an array of integers' do
      parameter = {numbers: [1,2,3,4]}
      example_payload = [
        {
          'name' => 'numbers',
          'parameterType' => {
            'type' => QuillBigQuery::PreTransformer::ARRAY_TYPE,
            'arrayType' => {
              'type' => 'INTEGER'
            }
          },
          'parameterValue' => {
            'arrayValues' => [
              {'value' => '1'},
              {'value' => '2'},
              {'value' => '3'},
              {'value' => '4'}
            ]
          }
        }
      ]
      expect(QuillBigQuery::PreTransformer.build_array_query_params(parameter)).to eq(example_payload)
    end

    it 'returns the properly formatted payload for an array of strings' do
      parameter = {words: ['alpha', 'beta', 'charlie', 'delta']}
      example_payload = [
        {
          'name' => 'words',
          'parameterType' => {
            'type' => QuillBigQuery::PreTransformer::ARRAY_TYPE,
            'arrayType' => {
              'type' => 'STRING'
            }
          },
          'parameterValue' => {
            'arrayValues' => [
              {'value' => 'alpha'},
              {'value' => 'beta'},
              {'value' => 'charlie'},
              {'value' => 'delta'}
            ]
          }
        }
      ]
      expect(QuillBigQuery::PreTransformer.build_array_query_params(parameter)).to eq(example_payload)
    end
  end

  describe '#type_lookup' do
    it 'raises UnsupportedArrayParameterTypeError error if object is not string or integer' do
      parameter = 0.999
      expect { QuillBigQuery::PreTransformer.type_lookup(parameter) }.to raise_error(QuillBigQuery::PreTransformer::UnsupportedArrayParameterTypeError)
    end

    it 'returns STRING_TYPE if object is string' do
      expect(QuillBigQuery::PreTransformer.type_lookup('a string')).to eq(QuillBigQuery::PreTransformer::STRING_TYPE)
    end

    it 'returns INT_TYPE if object is integer' do
      expect(QuillBigQuery::PreTransformer.type_lookup(1)).to eq(QuillBigQuery::PreTransformer::INT_TYPE)
    end
  end

  describe '#transformed_query' do
    it 'returns the properly formatted payload for the complete transformed query if there are array parameters' do
      parameters = {words: ['alpha', 'beta', 'charlie', 'delta']}
      query = 'this is a query'
      example_payload = {
        'query' => query,
        'useLegacySql' => false,
        'queryParameters' => [
          {
            'name' => 'words',
            'parameterType' => {
              'type' => QuillBigQuery::PreTransformer::ARRAY_TYPE,
              'arrayType' => {
                'type' => 'STRING'
              }
            },
            'parameterValue' => {
              'arrayValues' => [
                {'value' => 'alpha'},
                {'value' => 'beta'},
                {'value' => 'charlie'},
                {'value' => 'delta'}
              ]
            }
          }
        ]
      }
      expect(QuillBigQuery::PreTransformer.new(query, parameters).transformed_query).to eq(example_payload)
    end

    it 'returns the properly formatted payload for the complete transformed query if there are no array parameters' do
      query = 'this is a query'
      example_payload = {
        'query' => query,
        'useLegacySql' => false,
        'queryParameters' => [
        ]
      }
      expect(QuillBigQuery::PreTransformer.new(query).transformed_query).to eq(example_payload)
    end
  end

end
