# frozen_string_literal: true

module LearnWorldsIntegration
  class SSORequest < Request
    class NilUserError < StandardError; end
    class NilEmailError < StandardError; end

    attr_reader :user

    delegate :email, :learn_worlds_account, :name, :username, to: :user

    def initialize(user)
      @user = user
    end

    def run
      raise NilUserError if user.nil?
      raise NilEmailError if email.nil?

      HTTParty.post(endpoint, body:, headers:)
    end

    def endpoint = SSO_ENDPOINT

    def body = URI.encode_www_form(data)

    def data
      learn_worlds_account ? existing_user_data : new_user_data
    end

    private def existing_user_data
      {
        redirectURL: COURSES_ENDPOINT,
        user_id: learn_worlds_account.external_id
      }
    end

    private def new_user_data
      {
        email: email,
        redirectURL: COURSES_ENDPOINT,
        username: ::Utils::String.to_username(username.presence || name)
      }
    end

  end
end
