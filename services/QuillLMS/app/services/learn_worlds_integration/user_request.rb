# frozen_string_literal: true

module LearnWorlds
  class UserRequest < ::ApplicationService
    class NilUserError < StandardError; end

    attr_reader :user

    def initialize(user)
      @user = user
    end

    def run
      raise NotImplementedError
    end

    private def headers
      {
        "Lw-Client" => CLIENT_ID,
        "Authorization" => "Bearer #{ACCESS_TOKEN}"
      }
    end
  end
end
