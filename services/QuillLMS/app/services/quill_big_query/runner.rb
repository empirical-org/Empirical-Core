# frozen_string_literal: true

# All messages to BigQuery should use this class

module QuillBigQuery
  class Runner
    PROJECT_ID = 'analytics-data-stores'

    class UnsupportedSchemaError < StandardError; end

    def self.valid_schema?(json_body)
      json_body['schema']['fields'].respond_to?(:count) &&
      json_body['rows'].respond_to?(:count)
    end

    # Params:
    #   fields: [{"name"=>"school_name", "type"=>"STRING", "mode"=>"NULLABLE"}...]
    #   array_of_hashes: [{'k' => 'v'}...]
    def self.coerce_values(fields, array_of_hashes)
      coerce_to_float = fields.filter {|f| ['INTEGER', 'FLOAT'].include?(f['type'])}.pluck('name')

      array_of_hashes.map do |hsh|
        hsh.each {|k,v| coerce_to_float.include?(k) && hsh[k] = v.to_f }
      end
    end

    def self.transform_response(json_body)
      raise UnsupportedSchemaError, json_body unless valid_schema?(json_body)

      # This parses to [{"id" => 1, "name"=> "Dan", }, {"id" => 2, "name" => "Peter"}]
      raw_fields = json_body["schema"]["fields"]
      fields = raw_fields.pluck("name")
      values = json_body['rows'].pluck('f').map { |val_hash| val_hash.pluck('v') }
      hash_results = values.map {|v| fields.zip(v).to_h}
      coerce_values(raw_fields, hash_results)
    end

    def self.get_response(query)
      client = ClientFetcher.run
      # API discovery https://github.com/googleapis/google-api-ruby-client/tree/v0.8.6#api-discovery
      bigquery = client.discovered_api('bigquery', 'v2')

      # API reference: https://cloud.google.com/bigquery/docs/reference/rest/v2/jobs/query?apix_params=%7B%22projectId%22%3A%22analytics-data-stores%22%2C%22resource%22%3A%7B%22query%22%3A%22SELECT%20email%20from%20lms.users%20LIMIT%201%22%7D%7D
      result = client.execute(
        api_method: bigquery.jobs.query,
        parameters: {'projectId' => PROJECT_ID},
        body_object: {'query' => query, 'useLegacySql' => false}
      )

      body = JSON.parse(result.response.body)
    end

    def self.execute(query)
      response = get_response(query)
      transform_response(response)
    end
  end
end
