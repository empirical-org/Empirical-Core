# frozen_string_literal: true

module Evidence
  module OpenAI
    class Completion < Evidence::ApplicationService
      include Evidence::OpenAI::Concerns::API
      include Evidence::OpenAI::Concerns::SentenceResults

      ENDPOINT = '/completions'

      MAX_TOKENS = 24
      # A-D, (A)Least -> (D)Most Complex/Expensive
      MODELS = {
        ada: 'text-ada-001',
        babbage: 'text-babbage-001',
        curie: 'text-curie-001',
        davinci: 'text-davinci-002'
      }

      STOP_TOKENS = [". ", "; ", "? ", "! "] # max of 4 stop tokens
      MAX_COUNT = 128 # API has an undocument max of 128 for 'n'

      attr_accessor :prompt, :temperature, :count, :model_key, :options_hash

      def initialize(prompt:, temperature: 0.5, count: 1, model_key: :curie, options_hash: {})
        @prompt = prompt
        @temperature = temperature
        @count = count
        @model_key = model_key
        @options_hash = options_hash
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
        }.merge(options_hash)
      end
    end
  end
end
