# frozen_string_literal: true

module QuillBigQuery
  class Transformer
    attr_reader :field_to_lambda, :array_of_hashes

    class UnsupportedBigQueryType < StandardError; end

    def initialize(fields, array_of_hashes)
      @field_to_lambda = self.class.build_field_to_lambda_lookup(fields)
      @array_of_hashes = array_of_hashes
    end

    LAMBDA_TO_BOOLEAN   = ->(val) { val == 'true' }
    LAMBDA_TO_DATETIME  = ->(val) { DateTime.parse(val) }
    LAMBDA_TO_F         = ->(val) { val.to_f }
    LAMBDA_TO_INT       = ->(val) { val.to_i }
    LAMBDA_IDENTITY     = ->(val) { val }

    TYPE_TO_LAMBDA_LOOKUP = {
      'ARRAY'       => LAMBDA_IDENTITY,
      'BIGNUMERIC'  => LAMBDA_IDENTITY,     # '5.2e+37'
      'BOOLEAN'     => LAMBDA_TO_BOOLEAN,   # 'true'
      'BOOL'        => LAMBDA_TO_BOOLEAN,
      'BYTES'       => LAMBDA_IDENTITY,
      'DATE'        => LAMBDA_TO_DATETIME,  # '2022-01-01'
      'DATETIME'    => LAMBDA_TO_DATETIME,  # '2022-05-06T17:08:44.915791'
      'FLOAT'       => LAMBDA_TO_F,
      'FLOAT64'     => LAMBDA_TO_F,
      'GEOGRAPHY'   => LAMBDA_IDENTITY,
      'INTEGER'     => LAMBDA_TO_INT,
      'INT64'       => LAMBDA_TO_INT,
      'NUMERIC'     => LAMBDA_TO_INT,
      'STRING'      => LAMBDA_IDENTITY,
      'STRUCT'      => LAMBDA_IDENTITY,
      'TIME'        => LAMBDA_TO_DATETIME,
      'TIMESTAMP'   => LAMBDA_TO_DATETIME   # '2021-05-01 21:32:45'
    }

    def self.build_field_to_lambda_lookup(fields)
      fields.reduce({}) do |memo, field|
        field_name = field['name']
        field_type = field['type']
        memo[field_name] = TYPE_TO_LAMBDA_LOOKUP.fetch(field_type, LAMBDA_IDENTITY)
        memo
      end
    end

    def transform_pair(key, value)
      return nil unless value

      field_to_lambda.fetch(key).call(value)
    end

    def transform
      array_of_hashes.map do |hsh|
        hsh.each {|k,v| hsh[k] = transform_pair(k,v) }
      end
    end

  end
end
