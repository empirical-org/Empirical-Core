# frozen_string_literal: true

class RawSqlRunner
  CODERS = [
    PG::TextDecoder::Boolean.new(oid: 16),
    PG::TextDecoder::Integer.new(oid: 20),
    PG::TextDecoder::Integer.new(oid: 21),
    PG::TextDecoder::Integer.new(oid: 23),
    PG::TextDecoder::Integer.new(oid: 26),
    PG::TextDecoder::Float.new(oid: 700),
    PG::TextDecoder::Float.new(oid: 701)
  ]

  DEFAULT_TYPE_MAP_BY_OID =
    PG::TypeMapByOid.new.tap do |type_map|
      CODERS.each { |coder| type_map.add_coder(coder) }
    end

  def self.execute(sql, name = nil)
    ActiveRecord::Base.connection.execute(sql, name).tap do |pg_result|
      pg_result.type_map = DEFAULT_TYPE_MAP_BY_OID
    end
  end
end