# frozen_string_literal: true

module Evidence
  module OpenAI
    class Completion < Evidence::ApplicationService
      include Evidence::OpenAI::Concerns::Api

      ENDPOINT = '/chat/completions'

      attr_reader :prompt, :llm, :temperature

      def initialize(prompt:, llm:, temperature:)
        @prompt = prompt
        @llm = llm
        @temperature = temperature
      end

      def endpoint = ENDPOINT

      def cleaned_results
        response
          .parsed_response['choices']
          &.first
          &.dig('message', 'content')
      end

      def request_body
        {
          model: llm.version,
          messages: [
            { role: 'user', content: prompt }
          ],
          temperature:,
          response_format: { type: 'json_object' }
        }
      end
    end
  end
end
