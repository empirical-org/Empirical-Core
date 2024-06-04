# frozen_string_literal: true

module LearnWorldsIntegration
  class UserTagsRequest < UserRequest

    def endpoint = "#{USER_TAGS_ENDPOINT}/#{learn_worlds_account.external_id}"

    def run
      raise NilUserError if user.nil?
      raise NilEmailError if email.nil?

      HTTParty.put(endpoint, body: data.to_json, headers: headers, :debug_output => $stdout)
    end

    def data
      {
        tags: [
          "test1", "test3"
        ]
      }
    end

  end
end
