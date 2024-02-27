# frozen_string_literal: true

# Only Material View Refreshers need to use this runner with write permission

module QuillBigQuery
  class MaterializedViewRunner < ::ApplicationService
    attr_reader :query, :query_fallback

    BROKEN_MATERIALIZED_VIEW_ERRORS = [
      ::Google::Cloud::NotFoundError,
      ::Google::Cloud::InvalidArgumentError
    ]

    def initialize(query, query_fallback)
      @query = query
      @query_fallback = query_fallback
    end

    def run
      run_query(query)
    rescue *BROKEN_MATERIALIZED_VIEW_ERRORS => e
      run_query(query_fallback)
    end

    def client = @client ||= Google::Cloud::Bigquery.new

    def run_query(sql) = client.run(sql).all.to_a
  end
end
