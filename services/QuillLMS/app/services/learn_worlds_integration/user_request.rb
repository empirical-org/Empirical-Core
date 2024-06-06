# frozen_string_literal: true

module LearnWorldsIntegration
  class UserRequest < ::ApplicationService
    class NilUserError < StandardError; end

    def run = raise NotImplementedError

    def headers
      {
        "Lw-Client" => CLIENT_ID,
        "Authorization" => "Bearer #{ACCESS_TOKEN}"
      }
    end
  end
end
