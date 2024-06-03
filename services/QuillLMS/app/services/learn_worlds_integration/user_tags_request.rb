# frozen_string_literal: true

module LearnWorldsIntegration
  class UserTagsRequest < UserRequest

    def data
      {
        "tags": [
          "test1"
        ],
        "action": "attach"
      }
    end

  end
end
