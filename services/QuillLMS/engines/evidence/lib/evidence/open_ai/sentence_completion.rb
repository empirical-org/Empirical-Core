# frozen_string_literal: true

module Evidence
  module OpenAI
    class SentenceCompletion < Evidence::ApplicationService
      include Evidence::OpenAI::Concerns::Api
      include Evidence::OpenAI::Concerns::SentenceResults

      ENDPOINT = '/completions'

      MAX_TOKENS = 24

      MODELS = {
        ada: 'text-ada-001',
        babbage: 'text-babbage-001',
        curie: 'text-curie-001',
        davinci: 'text-davinci-002',
        turbo35_instruct: 'gpt-3.5-turbo-instruct'
      }

      STOP_TOKENS = [". ", "; ", "? ", "! "] # max of 4 stop tokens
      MAX_COUNT = 128 # API has an undocument max of 128 for 'n'

      attr_accessor :prompt, :temperature, :count, :model_key, :options

      def initialize(prompt:, temperature: 0.5, count: 1, model_key: :turbo35_instruct, options: {})
        @prompt = prompt
        @temperature = temperature
        @count = count
        @model_key = model_key
        @options = options
      end

      def endpoint
        ENDPOINT
      end

      # https://beta.openai.com/docs/api-reference/completions/create
      def request_body
        # NB: 'suffix' key in documentation is not a valid key, will raise error
        {
          model: MODELS[model_key],
          temperature: temperature,
          prompt: prompt,
          n: [count.to_i, Evidence::OpenAI::MAX_COUNT].min,
          max_tokens: MAX_TOKENS,
          stop: STOP_TOKENS
        }.merge(options)
      end
    end
  end
end
