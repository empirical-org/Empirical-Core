# frozen_string_literal: true

module QuillBigQuery
  class PreTransformer

    def initialize(query, *array_params)
      @query = query
      @transformed_array_params = self.class.build_array_query_params(*array_params)
    end

    def self.build_array_query_params(*array_params)
      array_params.map do |array_param|
        name = array_param.keys.first
        array = array_param.values.first
        type = type_lookup(array_param.values.first.first)
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
      return 'STRING' if object.is_a? String

      return 'INTEGER'
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
