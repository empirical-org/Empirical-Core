# frozen_string_literal: true

module Evidence
  module Grammar
    class Client
      API_TIMEOUT = 5
      ALLOWED_PAYLOAD_KEYS = ['gapi_error', 'highlight']
      API_ENDPOINT = ENV['GRAMMAR_API_DOMAIN']

      class APIError < StandardError; end
      class APITimeoutError < StandardError; end
      TIMEOUT_ERROR_MESSAGE = "request took longer than #{API_TIMEOUT} seconds"

      def initialize(entry:, prompt_text:)
        @entry = entry
        @prompt_text = prompt_text
      end

      def post
        response = api_request

        if !response.success?
          raise APIError, "Encountered upstream error: #{response}"
        end

        response.filter { |k,v| ALLOWED_PAYLOAD_KEYS.include?(k) }
      end

      private def api_request
        HTTParty.post(
          API_ENDPOINT,
          headers:  {'Content-Type': 'application/json'},
          body:     {
            entry: @entry,
            prompt_text: @prompt_text
          }.to_json,
          timeout: API_TIMEOUT
        )
      rescue *Evidence::HTTP_TIMEOUT_ERRORS
        raise APITimeoutError, TIMEOUT_ERROR_MESSAGE
      end
    end
  end
end


