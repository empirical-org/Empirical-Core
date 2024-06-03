# frozen_string_literal: true

module LearnWorldsIntegration
  class UserTagsRequest < UserRequest

    def endpoint = "#{USER_TAGS_ENDPOINT}/#{learn_worlds_account.external_id}/tags"

    def data
      {
        email: email,
        tags: [
          "test1"
        ],
        action: "attach"
      }
    end

  end
end
