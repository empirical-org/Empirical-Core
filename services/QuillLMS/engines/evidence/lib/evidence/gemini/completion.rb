# frozen_string_literal: true

module Evidence
  module Gemini
    class Completion < Evidence::ApplicationService
      include Evidence::Gemini::Concerns::Api

      GENERATE_CONTENT = 'generateContent'

      attr_accessor :llm, :prompt

      def initialize(llm:, prompt:)
        @llm = llm
        @prompt = prompt
      end

      def request_body
        {
          "contents" => [
            {
              "parts" => [
                { "text" => prompt }
              ]
            }
          ]
        }.merge(llm.request_body_customizations)
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
