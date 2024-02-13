# frozen_string_literal: true

module QuillBigQuery
  class MaterializedViewRefresher < ApplicationService
    attr_reader :query_key

    QUERY_FOLDER = Rails.root + 'db/big_query/views/'
    CONFIG = Configs[:big_query_views]
    VALID_KEYS = [
      'reporting_sessions_view'
    ]

    class InvalidQueryKeyError < StandardError; end

    def initialize(query_key)
      @query_key = query_key

      raise InvalidQueryKeyError if query_key.not_in?(VALID_KEYS)
    end

    def run
      QuillBigQuery::WritePermissionsRunner.execute(drop_view)

      QuillBigQuery::WritePermissionsRunner.execute(create_view)
    end

    private def create_view
      "CREATE MATERIALIZED VIEW #{name} #{create_options} AS (#{create_sql})"
    end

    private def drop_view
      "DROP MATERIALIZED VIEW IF EXISTS #{name}"
    end

    private def config = @config ||= CONFIG[query_key]
    private def name = config[:name]
    private def create_sql = File.read(QUERY_FOLDER + config[:create_sql])
    private def create_options = config[:create_options]
  end
end
