# frozen_string_literal: true

module QuillBigQuery
  class Pretransformer

    def initialize(query, *arrayParams)
      @query = query
      @transformed_array_params = self.class.build_array_query_params(*arrayParams)
    end

    def self.build_array_query_params(*arrayParams)
      arrayParams.map do |arrayParam|
        name = arrayParam.keys.first
        array = arrayParam.values.first
        type = type_lookup(arrayParam.values.first.first)
        {
          'name' => name,
          'parameterType' => {
            'type' => 'ARRAY',
            'arrayType' => {
              'type' => type
            }
          },
          'parameterValue' => {
            'arrayValues' => [
              array.map { |v| { 'value' => v.to_s }}
            ]
          }
        }
      end
    end

    def self.type_lookup(object)
      if object.is_a? String
        return 'STRING'
      elsif object.is_a? Integer
        return 'INTEGER'
      end
    end

    def transformed_query
      body_object = {
        'query' => @query,
        'useLegacySql' => false,
        'queryParameters'=> [
          @transformed_array_params
        ]
      }
    end
  end
end
