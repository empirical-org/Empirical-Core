# frozen_string_literal: true

module GoogleIntegration
  class SignetClientFetcher < ::ApplicationService
    class NilRefreshTokenError < ::StandardError; end

    TOKEN_CREDENTIAL_URI = 'https://oauth2.googleapis.com/token'

    attr_reader :refresh_token, :options

    def initialize(refresh_token, **options)
      @refresh_token = refresh_token
      @options = options
    end

    def run
      raise NilRefreshTokenError if refresh_token.nil?

      ::Signet::OAuth2::Client.new(client_args)
    end

    private def base_args
      {
        client_id: ::Auth::Google::CLIENT_ID,
        client_secret: ::Auth::Google::CLIENT_SECRET,
        refresh_token: refresh_token,
        token_credential_uri: TOKEN_CREDENTIAL_URI
      }
    end

    private def client_args
      base_args.merge(**options)
    end
  end
end
