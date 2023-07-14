# frozen_string_literal: true

module QuillBigQuery
  class PreTransformer
    ARRAY_TYPE = 'ARRAY'
    STRING_TYPE = 'STRING'
    INT_TYPE = 'INTEGER'

    class UnsupportedArrayParameterTypeError < StandardError; end
    class EmptyArrayParameterError < StandardError; end

    def initialize(query, **array_params)
      @query = query
      @transformed_array_params = self.class.build_array_query_params(**array_params)
    end

    # according to Google Cloud BigQuery API as documented here:
    # https://cloud.google.com/bigquery/docs/reference/rest/v2/QueryParameter
    def self.build_array_query_params(**array_params)
      array_params.map do |name, values|
        raise EmptyArrayParameterError if values.first.blank?

        type = type_lookup(values.first)
        {
          'name' => name.to_s,
          'parameterType' => {
            'type' => ARRAY_TYPE,
            'arrayType' => {
              'type' => type
            }
          },
          'parameterValue' => {
            'arrayValues' => values.map { |v| { 'value' => v.to_s }}
          }
        }
      end
    end

    def self.type_lookup(object)
      raise UnsupportedArrayParameterTypeError unless object.is_a?(String) || object.is_a?(Integer)

      return STRING_TYPE if object.is_a? String

      return INT_TYPE
    end

    def transform
      {
        'query' => @query,
        'useLegacySql' => false,
        'queryParameters'=> @transformed_array_params
      }
    end
  end
end
