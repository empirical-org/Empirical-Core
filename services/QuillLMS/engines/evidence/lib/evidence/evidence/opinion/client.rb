# frozen_string_literal: true

module Evidence
  module Opinion
    class Client
      API_TIMEOUT = 5
      ALLOWED_PAYLOAD_KEYS = ['oapi_error', 'highlight']
      API_ENDPOINT = ENV['OPINION_API_DOMAIN']

      class OpinionAPIError < StandardError; end

      def initialize(entry:, prompt_text:)
        @entry = entry
        @prompt_text = prompt_text
      end

      def post
        response = HTTParty.post(
          API_ENDPOINT,
          headers:  {'Content-Type': 'application/json'},
          body:     {
            entry: @entry,
            prompt_text: @prompt_text
          }.to_json,
          timeout: API_TIMEOUT
        )

        if !response.success?
          raise OpinionAPIError, "Encountered upstream error: #{response}"
        end

        response.filter { |k,v| ALLOWED_PAYLOAD_KEYS.include?(k) }

      end
    end

  end
end


