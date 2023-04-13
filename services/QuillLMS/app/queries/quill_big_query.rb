# frozen_string_literal: true

# All messages to BigQuery should use this module

require 'google/api_client'
require 'googleauth'
require 'stringio'

module QuillBigQuery
  PROJECT_ID = 'analytics-data-stores'
  FLOAT_FIELDS = %w(correct incorrect percentage)

  class UnsupportedSchemaError < StandardError; end

  def self.valid_schema?(json_body)
    return false unless json_body['schema']['fields'].respond_to?(:count)
    return false unless json_body['rows'].respond_to?(:count)

    true
  end

  def self.floatify_fields(array_of_hashes)
    array_of_hashes.map do |hsh|
      hsh.each {|k,v| FLOAT_FIELDS.include?(k) && hsh[k] = v.to_f }
    end
    array_of_hashes
  end

  def self.transform_response(json_body)
    raise UnsupportedSchemaError, json_body unless valid_schema?(json_body)

    # Parsing - It returns row names and values separately in an odd setup
    # This parses them down to [{"id" => 1, "name"=> "Dan", }, {"id" => 2, "name" => "Peter"}]
    fields = json_body["schema"]["fields"].map {|h| h["name"]}
    values = json_body["rows"].map {|r| r.values_at("f").flatten.map {|h| h.values.first}}
    hash_results = values.map {|v| fields.zip(v).to_h}
    floatify_fields(hash_results)
  end

  def self.get_response(query)
    user_agent = ["quill/0.0.0", "google-api-ruby-client/0.8.6", "Mac OS X",'(gzip)'].join(' ').delete("\n")
    client = Google::APIClient.new(application_name: 'quill', user_agent: user_agent)

    # API discovery https://github.com/googleapis/google-api-ruby-client/tree/v0.8.6#api-discovery
    bigquery = client.discovered_api('bigquery', 'v2')
    scope = 'https://www.googleapis.com/auth/bigquery'

    # make_creds expects a file, so we wrap the JSON env var in an IO stream
    json_credential_io = StringIO.new(ENV.fetch('BIGQUERY_CREDENTIALS'))

    # Auth Service account: https://github.com/googleapis/google-auth-library-ruby#example-service-account
    authorizer = Google::Auth::ServiceAccountCredentials.make_creds(json_key_io: json_credential_io, scope: scope)

    client.authorization = authorizer
    client.authorization.fetch_access_token!

    # API reference: https://cloud.google.com/bigquery/docs/reference/rest/v2/jobs/query?apix_params=%7B%22projectId%22%3A%22analytics-data-stores%22%2C%22resource%22%3A%7B%22query%22%3A%22SELECT%20email%20from%20lms.users%20LIMIT%201%22%7D%7D
    result = client.execute(
      api_method: bigquery.jobs.query,
      parameters: {'projectId' => PROJECT_ID},
      body_object: {'query' => query, 'useLegacySql' => false}
    )

    body = JSON.parse(result.response.body)
  end

  def self.execute(query)
    transform_response(get_response(query))
  end
end
