# frozen_string_literal: true

module Evidence
  module OpenAI
    module Concerns
      module Api
        extend ActiveSupport::Concern

        BASE_URI = 'https://api.openai.com/v1'
        TIMEOUT = 5.minutes.to_i

        included do
          include HTTParty
          base_uri BASE_URI

          attr_accessor :response
        end

        # classes using this concern require these methods
        def endpoint
          raise NotImplementedError
        end

        def request_body
          raise NotImplementedError
        end

        def cleaned_results
          raise NotImplementedError
        end

        def run
          return cleaned_results if response.present?

          @response = post_request

          cleaned_results
        rescue *Evidence::HTTP_TIMEOUT_ERRORS
          []
        end

        private def headers
          {
            'Content-Type' => 'application/json',
            'Authorization' => "Bearer #{Evidence::OpenAI::API_KEY}"
          }
        end

        private def post_request
          self.class.post(endpoint, body: request_body.to_json, headers: headers, timeout: TIMEOUT)
        end
      end
    end
  end
end
