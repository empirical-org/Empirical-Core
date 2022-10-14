# frozen_string_literal: true

module Evidence
  module OpenAI
    module Concerns::API
      extend ActiveSupport::Concern

      included do
        include HTTParty
        base_uri 'https://api.openai.com/v1'

        attr_accessor :response
      end

      # classes using this concern require these methods
      prepended do
        def endpoint; raise NotImplementedError; end
        def request_body; raise NotImplementedError; end
        def cleaned_results; raise NotImplementedError; end
      end

      def run
        return cleaned_results if response.present?

        @response = self.class.post(endpoint, body: request_body.to_json, headers: headers)

        cleaned_results
      end

      def headers
        {
          "Content-Type" => "application/json",
          "Authorization" => "Bearer #{Evidence::OpenAI::API_KEY}"
        }
      end
    end
  end
end
