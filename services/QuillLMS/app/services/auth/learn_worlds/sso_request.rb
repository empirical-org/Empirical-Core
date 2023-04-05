# frozen_string_literal: true

module Auth
  module LearnWorlds
    class SSORequest < ::ApplicationService
      class NilEmailError < StandardError; end
      class NilUserError < StandardError; end

      attr_reader :user

      delegate :email, :username, to: :user

      def initialize(user)
        @user = user
      end

      def run
        raise NilUserError if user.nil?
        raise NilEmailError if email.nil?

        response = HTTParty.post(SSO_ENDPOINT, body: body, headers: headers)
      end

      private def body
        URI.encode_www_form(data)
      end

      private def data
        user.learn_worlds_account ? existing_user_data : new_user_data
      end

      private def existing_user_data
        {
          redirectURL: COURSES_ENDPOINT,
          user_id: user.learn_worlds_account.external_id
        }
      end

      private def new_user_data
        {
          email: email,
          redirectURL: COURSES_ENDPOINT,
          username: username || email
        }
      end

      private def headers
        {
          "Lw-Client" => CLIENT_ID,
          "Authorization" => "Bearer #{ACCESS_TOKEN}"
        }
      end
    end
  end
end
