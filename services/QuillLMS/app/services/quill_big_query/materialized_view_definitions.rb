# frozen_string_literal: true

module QuillBigQuery
  class MaterializedViewDefinitions < ApplicationService
    QUERY_FOLDER = Rails.root.join('db/big_query/views/')
    CONFIG = Configs[:big_query_views]
    VALID_KEYS = Configs[:big_query_views].keys

    class InvalidQueryKeyError < StandardError; end

    def self.fetch(query_key)
      raise InvalidQueryKeyError, query_key unless query_key.in?(VALID_KEYS)

      {
        name: CONFIG[query_key][:name],
        sql: File.read(QUERY_FOLDER + CONFIG[query_key][:create_sql]),
        create_options: CONFIG[query_key][:create_options]
      }
    end
  end
end
