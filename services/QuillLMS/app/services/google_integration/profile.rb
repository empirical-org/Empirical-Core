# frozen_string_literal: true

module GoogleIntegration
  class Profile
    def initialize(request, session)
      @session = session
      @request = request
    end

    def name
      info.name if info.present?
    end

    def email
      info.email if info.present?
    end

    def google_id
      omniauth_data.uid if omniauth_data.present?
    end

    def refresh_token
      credentials.refresh_token if credentials.present?
    end

    def access_token
      credentials.token if credentials.present?
    end

    def expires_at
      Time.at(expiration_in_epoch_time) if expiration_in_epoch_time.present?
    end

    def role
      @session['role']
    end

    def info
      omniauth_data.info if omniauth_data.present?
    end

    private def expiration_in_epoch_time
      return unless credentials.present?

      credentials.expires_at || credentials.expires_in
    end

    private def credentials
      omniauth_data.credentials if omniauth_data.present?
    end

    private def omniauth_data
      @request.env['omniauth.auth']
    end
  end
end
