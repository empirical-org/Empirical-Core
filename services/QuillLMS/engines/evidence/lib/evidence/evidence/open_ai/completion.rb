# frozen_string_literal: true

module Evidence
  module OpenAI
    class Completion < Evidence::ApplicationService
      include HTTParty
      base_uri 'https://api.openai.com/v1'

      API_KEY = ENV['OPENAI_API_KEY']
      MAX_TOKENS = 24
      ENDPOINT = '/completions'
      # A-D, (A)Least -> (D)Most Complex/Expensive
      MODELS = {
        ada: 'text-ada-001',
        babbage: 'text-babbage-001',
        curie: 'text-curie-001',
        davinci: 'text-davinci-002'
      }
      BLANK = ''
      STOP_TOKENS = [". ", ", "]
      MAX_COUNT = 128 # API has an undocumented max of 128 for 'n'
      MIN_RESPONSE_LENGTH = 10

      attr_accessor :response, :prompt, :temperature, :count, :model_key, :options_hash

      def initialize(prompt:, temperature: 0.5, count: 1, model_key: :curie, options_hash: {})
        @prompt = prompt
        @temperature = temperature
        @count = count
        @model_key = model_key
        @options_hash = options_hash
      end

      def headers
        {
          "Content-Type" => "application/json",
          "Authorization" => "Bearer #{API_KEY}"
        }
      end

      def request_body
        {
          model: MODELS[model_key],
          temperature: temperature,
          prompt: prompt,
          n: [count.to_i, MAX_COUNT].min,
          max_tokens: MAX_TOKENS,
          stop: STOP_TOKENS
        }.merge(options_hash)
      end

      def run
        return response if response.present?

        @response = self.class.post(ENDPOINT, body: request_body.to_json, headers: headers)

        cleaned_results
      end

      def cleaned_results
        result_texts_removed_characters
          .map{|r| r&.split(/\n/)&.first } # drop anything after a \n
          .map{|r| r&.strip } # remove leading/ending spaces
          .compact
          .select {|r| r.length >= MIN_RESPONSE_LENGTH}
          .uniq
      end

      def result_texts_removed_characters
        result_texts
          .map{|r| r&.gsub(/^(\n|-|\s)+/, BLANK)} # strip all leading \n, -, or whitespace
          .map{|r| r&.gsub(/(\]|\[|=|\d\))/, BLANK)} # strip brackets, equal signs, and 1), 2)
      end

      private def result_texts
        response
          .parsed_response['choices']
          .map{|r| r['text']}
      end

      def reset_response
        @response = nil
      end
    end
  end
end
