# frozen_string_literal: true

module LearnWorldsIntegration
  class UnsuspendUserRequest < Request
    attr_reader :external_id

    def initialize(external_id)
      @external_id = external_id
    end

    def endpoint = "#{USER_TAGS_ENDPOINT}/#{external_id}/unsuspend"

    def run = HTTParty.put(endpoint, headers:)
  end
end
