# frozen_string_literal: true
require 'pp'

class ConceptResultSchema
  JSON_PRIMITIVE_TYPE_NAMES = {
    'Float'       => 'number',
    'FalseClass'  => 'boolean',
    'Integer'     => 'integer',
    'NilClass'    => 'null',
    'String'      => 'string',
    'TrueClass'   => 'boolean'
  }

  def self.run
    schema = {}
    counter = 0
    ConceptResult.all.find_in_batches do |batch|
      batch.each do |row|
        counter += 1
        schema = merge_schema(schema, compute(row.metadata).first)
      end
    end
    puts "#{counter} records evaluated."
    pp(schema)
  end

  def self.merge_schema(hash1, hash2)
    hash1.merge(hash2) do |key, leftval, rightval|
      leftval.concat(rightval).uniq
    end
  end

  def self.compute(jsonish)
    if jsonish.class == Hash
      schema = {}
      jsonish.each do |k,v|
        schema[k] = compute(v)
      end
      return [schema]
    end

    if jsonish.class == Array
      return ['array']
    end

    return [json_primitive_type(jsonish.class)]
  end

  def self.json_primitive_type(klass_name)
    JSON_PRIMITIVE_TYPE_NAMES[klass_name.to_s]
  end

end
