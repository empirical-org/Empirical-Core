# frozen_string_literal: true

# All messages to BigQuery should use this class

module QuillBigQuery
  class Runner
    def self.execute(query)
      Google::Cloud::Bigquery.new.query(query).all.to_a
    rescue => e
      raise e, "Query: #{query}"
    end
  end
end
