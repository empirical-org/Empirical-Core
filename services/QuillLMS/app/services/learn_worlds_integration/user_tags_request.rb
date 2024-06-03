# frozen_string_literal: true

module LearnWorlds
  class UserTagsRequest < UserRequest


    def run
      raise NilUserError if user.nil?

      HTTParty.post(SSO_ENDPOINT, body: body, headers: headers)
    end

    private def body
      URI.encode_www_form(data)
    end

  end
end
