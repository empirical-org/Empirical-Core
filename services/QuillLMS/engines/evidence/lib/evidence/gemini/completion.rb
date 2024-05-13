# frozen_string_literal: true

module Evidence
  module Gemini
    class Completion < Evidence::ApplicationService
      include Evidence::Gemini::Concerns::Api

      GENERATE_CONTENT = 'generateContent'

      attr_accessor :llm_config, :prompt

      def initialize(llm_config:, prompt:)
        @llm_config = llm_config
        @prompt = prompt
      end

      def request_body = request_body_base.merge(request_body_custom)

      private def model_version = llm_config.version

      private def instruction = GENERATE_CONTENT

      private def request_body_base
        {
          "contents" => [
            {
              "parts" => [
                { "text" => prompt }
              ]
            }
          ]
        }
      end

      private def request_body_custom
        return {} unless llm_config.version == 'gemini-1.5-pro-latest'

        { "generationConfig": { "response_mime_type": "application/json" } }
      end

      private def cleaned_results
        response
          .parsed_response['candidates']
          .first
          .dig('content', 'parts')
          .first['text']
      rescue => e
        raise CleanedResultsError, e.message
      end
    end
  end
end
