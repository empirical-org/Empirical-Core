# frozen_string_literal: true

module Evidence
  module Gemini
    class Completion < Evidence::ApplicationService
      include Evidence::Gemini::Concerns::Api

      attr_accessor :prompt

      def initialize(prompt:)
        @prompt = prompt
      end

      # https://aistudio.google.com/app/apikey
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
        binding.pry
      end

    end
  end
end
