# frozen_string_literal: true

module Evidence
  module OpenAI
    class Completion < Evidence::ApplicationService
      include Evidence::OpenAI::Concerns::Api
      include Evidence::OpenAI::Concerns::SentenceResults

      ENDPOINT = '/chat/completions'

      MAX_TOKENS = 500

      # rubocop:disable Naming::VariableNumber
      MODELS = {
        turbo35_0125: 'gpt-3.5-turbo-0125',
        turbo4_2024_04_09: 'gpt-4-turbo-2024-04-09'
      }
      # rubocop:enable Naming::VariableNumber

      STOP_TOKENS = [". ", "; ", "? ", "! "] # max of 4 stop tokens
      MAX_COUNT = 128 # API has an undocument max of 128 for 'n'

      attr_accessor :prompt, :temperature, :count, :model_key, :options

      # rubocop:disable Naming::VariableNumber
      def initialize(prompt:, temperature: 0.5, count: 1, model_key: :turbo35_0125, llm_config: nil, options: {})
        @prompt = prompt
        @temperature = temperature
        @count = count
        @model_key = llm_config&.model_key
        @options = options
      end
      # rubocop:enable Naming::VariableNumber

      def endpoint = ENDPOINT

      def cleaned_results
        response
          .parsed_response['choices']
          &.first
          &.dig('message', 'content')
      end

      # https://beta.openai.com/docs/api-reference/completions/create
      def request_body
        # NB: 'suffix' key in documentation is not a valid key, will raise error
        {
          model: MODELS[model_key],
          temperature:,
          messages: [
            { role: 'user', content: prompt }
          ],
          n: [count.to_i, Evidence::OpenAI::MAX_COUNT].min,
          # max_tokens: MAX_TOKENS,
          # stop: STOP_TOKENS
        }.merge(options)
      end
    end
  end
end
