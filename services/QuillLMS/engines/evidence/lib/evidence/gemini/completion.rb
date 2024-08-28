# frozen_string_literal: true

module Evidence
  module Gemini
    class Completion < Evidence::ApplicationService
      include Evidence::Gemini::Concerns::Api

      GENERATE_CONTENT = 'generateContent'

      attr_reader :llm, :prompt, :temperature

      def initialize(llm:, prompt:, temperature:)
        @llm = llm
        @prompt = prompt
        @temperature = temperature
      end

      def request_body
        {
          'contents' => [
            {
              'parts' => [
                { 'text' => prompt }
              ]
            }
          ],
          'generationConfig' => {
            'temperature' => temperature,
            'response_mime_type' => 'application/json'
          }
        }
      end

      private def model_version = llm.version

      private def instruction = GENERATE_CONTENT

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
