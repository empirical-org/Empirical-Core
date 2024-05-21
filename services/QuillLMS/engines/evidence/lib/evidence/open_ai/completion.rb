# frozen_string_literal: true

module Evidence
  module OpenAI
    class Completion < Evidence::ApplicationService
      include Evidence::OpenAI::Concerns::Api

      ENDPOINT = '/chat/completions'

      attr_reader :prompt, :llm_config

      def initialize(prompt:, llm_config:)
        @prompt = prompt
        @llm_config = llm_config
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
          model: llm_config.version,
          messages: [
            { role: 'user', content: prompt }
          ],
        }.merge(llm_config.request_body_customizations)
      end
    end
  end
end
