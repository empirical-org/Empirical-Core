# frozen_string_literal: true

module LearnWorldsIntegration
  class UserRequest < ::ApplicationService
    class NilUserError < StandardError; end

    attr_reader :user

    def initialize(user)
      @user = user
    end

    def run
      raise NilUserError if user.nil?

      HTTParty.post(SSO_ENDPOINT, body: body, headers: headers)
    end

    def data
      raise NotImplementedError
    end

    private def body
      URI.encode_www_form(data)
    end

    private def headers
      {
        "Lw-Client" => CLIENT_ID,
        "Authorization" => "Bearer #{ACCESS_TOKEN}"
      }
    end
  end
end
