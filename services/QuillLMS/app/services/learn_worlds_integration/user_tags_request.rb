# frozen_string_literal: true

module LearnWorldsIntegration
  class UserTagsRequest < UserRequest

    def endpoint = "#{USER_TAGS_ENDPOINT}/#{learn_worlds_account.external_id}"

    def run
      raise NilUserError if user.nil?

      HTTParty.put(endpoint, body: body, headers: headers)
    end

    def body = data.to_json

    def data
      {
        tags: [
          "test1", "test3"
        ]
      }
    end

  end
end
