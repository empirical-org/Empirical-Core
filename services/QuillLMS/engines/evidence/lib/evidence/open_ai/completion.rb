# frozen_string_literal: true

module Evidence
  module OpenAI
    class Completion < Evidence::ApplicationService
      include Evidence::OpenAI::Concerns::Api

      ENDPOINT = '/chat/completions'

      attr_reader :prompt, :llm

      def initialize(prompt:, llm:)
        @prompt = prompt
        @llm = llm
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
          ]
        }.merge(llm.request_body_customizations)
      end
    end
  end
end
