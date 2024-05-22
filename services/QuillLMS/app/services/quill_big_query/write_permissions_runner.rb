# frozen_string_literal: true

# Only Material View Refreshers need to use this runner with write permission

module QuillBigQuery
  class WritePermissionsRunner < ::ApplicationService
    attr_reader :query

    CREDENTIALS = ENV.fetch('BIGQUERY_WRITE_CREDENTIALS', '')

    def initialize(query)
      @query = query
    end

    def run
      client.query(query)
    rescue => e
      raise e, "Query: #{query}"
    end

    def client
      @client ||= Google::Cloud::Bigquery.new(credentials: credentials)
    end

    def credentials = JSON.parse(CREDENTIALS)
  end
end
