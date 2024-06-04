# frozen_string_literal: true

module LearnWorldsIntegration
  class UserRequest < ::ApplicationService
    class NilUserError < StandardError; end

    attr_reader :user

    delegate :email, :learn_worlds_account, :username, to: :user

    def initialize(user)
      @user = user
    end

    def run
      raise NilUserError if user.nil?
      raise NilEmailError if email.nil?

      HTTParty.post(endpoint, body: body, headers: headers)
    end

    def data = raise NotImplementedError

    def endpoint = raise NotImplementedError

    def body = raise NotImplementedError

    private def headers
      {
        "Lw-Client" => CLIENT_ID,
        "Authorization" => "Bearer #{ACCESS_TOKEN}"
      }
    end
  end
end
