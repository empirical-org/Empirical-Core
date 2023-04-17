# frozen_string_literal: true

require 'google/api_client'
require 'googleauth'

module QuillBigQuery
  class ClientFetcher < ApplicationService
    USER_AGENT_DIRECTIVES = 'quill/0.0.0 google-api-ruby-client/0.8.6 Mac OS X (gzip)'
    SCOPE                 = 'https://www.googleapis.com/auth/bigquery'
    APPLICATION_NAME      = 'quill'

    def run
      client = Google::APIClient.new(application_name: APPLICATION_NAME, user_agent: USER_AGENT_DIRECTIVES)

      # Auth Service account: https://github.com/googleapis/google-auth-library-ruby#example-service-account
      authorizer = Google::Auth::ServiceAccountCredentials.make_creds(json_key_io: JSON_CREDENTIAL_IOSTREAM, scope: SCOPE)

      client.authorization = authorizer
      client.authorization.fetch_access_token!
      client
    end
  end
end