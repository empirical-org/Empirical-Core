# frozen_string_literal: true

module Evidence
  module OpenAI
    class EmbeddingFetcher < Evidence::ApplicationService
      include Evidence::OpenAI::Concerns::Api

      ENDPOINT = '/embeddings'

      attr_reader :dimension, :input, :model

      def initialize(dimension:, input:, model:)
        @dimension = dimension
        @input = input
        @model = model
      end

      def cleaned_results
        response
          .parsed_response['data']
          &.first&.[]('embedding')
      end

      def endpoint = ENDPOINT

      # https://platform.openai.com/docs/api-reference/embeddings/create
      def request_body = { dimension:, input:, model: }
    end
  end
end
