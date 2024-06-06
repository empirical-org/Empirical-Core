# frozen_string_literal: true

module LearnWorldsIntegration
  class UserTagsRequest < UserRequest

    attr_reader :external_id, :tags

    def endpoint
      "#{USER_TAGS_ENDPOINT}/#{external_id}"
    end

    def initialize(external_id, tags)
      raise ArgumentError, "Invalid tags: #{tags}" unless tags.respond_to?(:each)

      @external_id = external_id
      @tags = tags
    end

    def run = HTTParty.put(endpoint, body: data.to_json, headers: headers)

    def data = { tags: tags }

  end
end
