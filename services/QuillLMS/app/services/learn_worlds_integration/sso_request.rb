# frozen_string_literal: true

module LearnWorldsIntegration
  class SSORequest < UserRequest
    class NilEmailError < StandardError; end

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
        username: username.presence || email
      }
    end

  end
end
