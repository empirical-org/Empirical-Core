# frozen_string_literal: true

module LearnWorlds
  class SSORequest < UserRequest
    class NilEmailError < StandardError; end
    class NilUserError < StandardError; end

    attr_reader :user

    delegate :email, :learn_worlds_account, :username, to: :user

    def initialize(user)
      @user = user
    end

    def run
      raise NilUserError if user.nil?
      raise NilEmailError if email.nil?

      HTTParty.post(SSO_ENDPOINT, body: body, headers: headers)
    end



  end
end
