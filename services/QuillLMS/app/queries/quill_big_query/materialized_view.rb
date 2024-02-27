# frozen_string_literal: true

module QuillBigQuery
  class MaterializedView
    attr_reader :query_key

    QUERY_FOLDER = Rails.root.join('db/big_query/views/')
    CONFIG = Configs[:big_query_views]

    class InvalidQueryKeyError < StandardError; end

    def initialize(query_key)
      @query_key = query_key

      raise InvalidQueryKeyError unless query_key.in?(CONFIG.keys)
    end

    def refresh!
      QuillBigQuery::WritePermissionsRunner.run(drop_sql)

      QuillBigQuery::WritePermissionsRunner.run(create_sql)
    end

    # Adding a COUNT query after the creation for 2 reasons: since the
    # 1) BigQuery library errors when returning the contents
    # of a Materialized View, i.e. it runs the 'CREATE' operation successfully,
    # but the API errors when parsing the Materialized View details to return:
    # "Google::Apis::ClientError: invalid: Cannot list a table of type MATERIALIZED_VIEW."
    # 2) It seems the view isn't primed until it is queried, so querying it
    def create_sql
      <<-SQL.squish
        CREATE MATERIALIZED VIEW #{name} #{create_options} AS (#{sql.squish});
        SELECT COUNT(*) FROM #{name};
      SQL
    end

    def sql = File.read(QUERY_FOLDER + config[:sql])
    def drop_sql = "DROP MATERIALIZED VIEW IF EXISTS #{name}"
    def fallback_with_clause = "#{name_fallback} AS (#{sql.squish})"

    def name = config[:name]
    def name_with_dataset = "#{dataset}.#{name}"
    def name_fallback = config[:name_fallback]

    private def config = @config ||= CONFIG[query_key]
    private def dataset = config[:dataset]
    private def create_options = config[:create_options]
  end
end
