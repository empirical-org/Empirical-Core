# frozen_string_literal: true

module Evidence
  module Gemini
    class Completion < Evidence::ApplicationService
      include Evidence::Gemini::Concerns::Api

      class CleanedResultsError < StandardError; end

      GENERATE_CONTENT = 'generateContent'

      attr_accessor :llm_config, :prompt

      def initialize(llm_config:, prompt:)
        @llm_config = llm_config
        @prompt = prompt
      end

      private def model_version = llm_config.version
      private def instruction = GENERATE_CONTENT

      # From curl request body structure: https://aistudio.google.com/app/apikey
      def request_body
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
