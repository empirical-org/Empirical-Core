# frozen_string_literal: true

module LearnWorldsIntegration
  class UserTagsRequest < UserRequest

    attr_reader :external_id, :tags

    def initialize(external_id, tags)
      raise ArgumentError, "Invalid tags: #{tags}" unless tags.respond_to?(:each)

      @external_id = external_id
      @tags = tags
    end

    def endpoint = "#{USER_TAGS_ENDPOINT}/#{external_id}"

    def run = HTTParty.put(endpoint, body:, headers:)

    def body = data.to_json

    def data = { tags: }

  end
end
