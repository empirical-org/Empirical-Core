# frozen_string_literal: true

# Only Material View Refreshers need to use this runner with write permission

module QuillBigQuery
  class WritePermissionsRunner

    CREDENTIALS = ENV['BIGQUERY_WRITE_CREDENTIALS']

    def self.execute(query)
      client = Google::Cloud::Bigquery.new(credentials: CREDENTIALS)

      client.query(query).all.to_a
    rescue => e
      raise e, "Query: #{query}"
    end
  end
end
