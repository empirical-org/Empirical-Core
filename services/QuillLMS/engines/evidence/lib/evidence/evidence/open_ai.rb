# frozen_string_literal: true

module Evidence
  class OpenAI
    include HTTParty
    base_uri 'https://api.openai.com/v1'

    class NoResultsError < StandardError; end

    API_KEY = ENV['OPENAI_API_KEY']
    MAX_TOKENS = 24
    COMPLETION_ENDPOINT = '/completions'
    EDITS_ENDPOINT = '/edits'
    # A-D, (A)Least -> (D)Most Complex/Expensive
    COMPLETION_MODELS = {
      ada: 'text-ada-001',
      babbage: 'text-babbage-001',
      curie: 'text-curie-001',
      davinci: 'text-davinci-002'
    }
    EDIT_MODELS = {
      ada: 'text-ada-edit-001',
      babbage: 'text-babbage-edit-001',
      curie: 'text-curie-edit-001',
      davinci: 'text-davinci-edit-001'
    }

    attr_accessor :response, :prompt, :temperature, :count, :model_key, :options_hash

    def initialize(prompt:, temperature: 1, count: 1, model_key: :babbage, options_hash: {})
      @prompt = prompt
      @temperature = temperature
      @count = count
      @model_key = model_key
      @options_hash = options_hash
    end

    def self.header_options
      {
        "Content-Type" => "application/json",
        "Authorization" => "Bearer #{API_KEY}"
      }
    end

    def request_body
      {
        model: COMPLETION_MODELS[model_key],
        temperature: temperature,
        prompt: prompt,
        n: count,
        max_tokens: MAX_TOKENS,
        stop: [". ", ', ', "/\n/\n"]
      }.merge(options_hash)
    end

    def cleaned_results
      response
        .parsed_response['choices']
        .map{|r| r['text']}
        .map{|r| r.gsub(/^\n/,'')} # strip leading \n
        .map{|r| r.gsub(/^\n/,'')} # strip leading \n again
        .map{|r| r.gsub(/^\n/,'')} # strip leading \n a third time
        .map{|r| r.gsub(/^-/,'')} # strip leading dash
        .map{|r| r.gsub(/\d\)/,'')} # strip 1), 2), 3)
        .map{|r| r.gsub(/^\s/,'')} # strip leading spaces
        .map{|r| r.split(/\n/).first } # drop anything after a \n
        .compact
        .select {|r| r.length >= 10}
        .uniq
    end

    def request
      return response if response.present?

      @response = self.class.post(COMPLETION_ENDPOINT, body: request_body.to_json, headers: self.class.header_options)

      cleaned_results
    end

    def edits_request_body
      {
        model: EDIT_MODELS[model_key],
        temperature: temperature,
        input: prompt,
        instruction: PARAPHRASE_INSTRUCTION,
        n: count,
      }.merge(options_hash)
    end

    def edit_request
      return response if response.present?

      @response = self.class.post(EDITS_ENDPOINT, body: edits_request_body.to_json, headers: self.class.header_options)

      cleaned_results
    end

    def reset_request
      @response = nil
    end

  end
end
