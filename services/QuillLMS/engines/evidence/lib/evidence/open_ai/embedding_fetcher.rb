# frozen_string_literal: true

module Evidence
  module OpenAI
    class EmbeddingFetcher < Evidence::ApplicationService
      include Evidence::OpenAI::Concerns::Api

      ENDPOINT = '/embeddings'
      # Dimension and model are coupled: https://platform.openai.com/docs/guides/embeddings
      DEFAULT_DIMENSION = 1536
      DEFAULT_MODEL = 'text-embedding-3-small'

      attr_reader :dimension, :input, :model

      def initialize(input:, dimension: DEFAULT_DIMENSION, model: DEFAULT_MODEL)
        @dimension = dimension
        @input = input
        @model = model
      end

      def cleaned_results
        response
          .parsed_response['data']
          &.first
          &.[]('embedding')
      end

      def endpoint = ENDPOINT

      # https://platform.openai.com/docs/api-reference/embeddings/create
      def request_body = { dimension:, input:, model: }
    end
  end
end
