# frozen_string_literal: true

module GoogleIntegration
  class RefreshAccessToken
    class RefreshAccessTokenError < StandardError; end

    class NoRefreshTokenError < RefreshAccessTokenError
      def message
        "No existing Google Refresh Token available to submit"
      end
    end

    class TokenTooOldToRefreshError < RefreshAccessTokenError
      def message
        "Existing Google Access Token is too old to refresh"
      end
    end

    class FailedToRefreshTokenError < RefreshAccessTokenError; end

    class FailedToSaveRefreshedTokenError < RefreshAccessTokenError; end

    TOKEN_ENDPOINT = 'https://accounts.google.com/o/oauth2/token'

    def initialize(user, http_client = nil)
      @user        = user
      @http_client = http_client || HTTParty
    end

    def refresh
      if should_refresh?
        raise NoRefreshTokenError if !current_credentials&.refresh_token
        # According to Google documentation, refresh tokens older than
        # 6 months can not be refreshed:
        # https://developers.google.com/identity/protocols/OAuth2#expiration
        raise TokenTooOldToRefreshError if token_too_old_to_refresh?

        handle_response(make_request)
      else
        current_credentials
      end
    end

    private def make_request
      @http_client.post(TOKEN_ENDPOINT, refresh_token_options)
    end

    private def handle_response(response)
      if response.code == 200
        store_credentials(response)
      else
        msg = "Non-200 response when attempting to refresh access token: '#{response.parsed_response['error']}'"
        # delete current_credentials so that user is forced to login again
        current_credentials.destroy!
        raise FailedToRefreshTokenError, msg
      end
    end

    private def store_credentials(response)
      data       = response.parsed_response
      attributes = parse_attributes(data)

      if current_credentials.update(attributes)
        current_credentials.reload
      else
        msg = "Failed to save updated access token: '#{current_credentials.errors.messages}'"
        raise FailedToSaveRefreshedTokenError, msg
      end
    end

    private def parse_attributes(data)
      {}.tap do |attributes|
        attributes[:access_token] = data['access_token'] if data['access_token'].present?
        attributes[:expires_at] = data['expires_in'] if data['expires_in'].present?
        attributes[:timestamp] = data['issued_at'] if data['issued_at'].present?
      end
    end

    private def refresh_token
      current_credentials.refresh_token
    end

    private def current_credentials
      @current_credentials ||= @user.auth_credential
    end

    private def should_refresh?
      current_credentials && ( nil_access_token_expiration? || access_token_expired? )
    end

    private def nil_access_token_expiration?
      current_credentials.expires_at.nil?
    end

    private def access_token_expired?
      Time.current > current_credentials.expires_at
    end

    private def token_too_old_to_refresh?
      return false if nil_access_token_expiration?

      Time.current >= current_credentials.refresh_token_expires_at
    end

    private def refresh_token_options
      {
        body: {
          client_id: ENV["GOOGLE_CLIENT_ID"],
          client_secret: ENV["GOOGLE_CLIENT_SECRET"],
          refresh_token: refresh_token,
          grant_type: 'refresh_token'
        },
        headers: {
          'Content-Type' => 'application/x-www-form-urlencoded'
        }
      }
    end
  end
end
