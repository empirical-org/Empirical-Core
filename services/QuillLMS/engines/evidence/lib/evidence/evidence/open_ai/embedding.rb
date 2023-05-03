# frozen_string_literal: true

module Evidence
  module OpenAI
    class Embedding < Evidence::ApplicationService
      include Evidence::OpenAI::Concerns::API

      ENDPOINT = '/embeddings'

      # https://platform.openai.com/docs/guides/embeddings
      # Recommended model for this endpoint
      MODEL = 'text-embedding-ada-002'

      attr_reader :input

      def initialize(input:)
        @input = input
      end

      def endpoint
        ENDPOINT
      end

      def cleaned_results
        response
          .parsed_response['data']
          &.first['embedding']
      end

      # https://platform.openai.com/docs/api-reference/embeddings/create
      def request_body
        {
          model: MODEL,
          input: input,
        }
      end
    end
  end
end
