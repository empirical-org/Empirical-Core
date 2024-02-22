# frozen_string_literal: true

module QuillBigQuery
  class MaterializedView < ApplicationService
    attr_reader :name, :sql, :create_options

    QUERY_FOLDER = Rails.root.join('db/big_query/views/')
    CONFIG = Configs[:big_query_views]
    VALID_KEYS = Configs[:big_query_views].keys

    class InvalidQueryKeyError < StandardError; end

    def initialize(name:, sql:, create_options: nil)
      @name = name
      @sql = sql
      @create_options = create_options
    end

    def self.fetch(query_key)
      raise InvalidQueryKeyError, query_key unless query_key.in?(VALID_KEYS)

      new(
        name: CONFIG[query_key][:name],
        sql: File.read(QUERY_FOLDER + CONFIG[query_key][:create_sql]),
        create_options: CONFIG[query_key][:create_options]
      )
    end
  end
end
