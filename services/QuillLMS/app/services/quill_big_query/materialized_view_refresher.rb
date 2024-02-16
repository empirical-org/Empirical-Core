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

      raise InvalidQueryKeyError unless query_key.in?(VALID_KEYS)
    end

    def run
      QuillBigQuery::WritePermissionsRunner.run(drop_view)

      QuillBigQuery::WritePermissionsRunner.run(create_view)
    end

    # Adding a 'SELECT 1;' query since the BigQuery library errors when returning the contents
    # of a Materialized View, i.e. it runs the 'CREATE' operation successfully,
    # but the API errors when parsing the Materialized View details to return:
    # "Google::Apis::ClientError: invalid: Cannot list a table of type MATERIALIZED_VIEW."
    private def create_view
      <<-SQL.squish
        CREATE MATERIALIZED VIEW #{name} #{create_options} AS (#{create_sql.squish});
        SELECT 1;
      SQL
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
