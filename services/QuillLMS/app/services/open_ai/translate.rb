# frozen_string_literal: true

module OpenAI
  class Translate < ApplicationService
    include OpenAI::Api
    ENDPOINT = '/chat/completions'
    MODEL = 'gpt-4-turbo'

    KEY_ROLE = 'role'
    KEY_CONTENT = 'content'
    ROLE_SYSTEM = 'system'
    ROLE_USER = 'user'
    ROLE_ASSISTANT = 'assistant'
    RESPONSE_FORMAT = { 'type' => 'text' }
    attr_reader :system_prompt

    def initialize(english_text:, prompt:)
      @system_prompt = prompt + english_text
    end

    private def system_message = {KEY_ROLE => ROLE_SYSTEM, KEY_CONTENT => system_prompt}

    def cleaned_results
      return nil if response&.body&.nil?

      result_json_string
    end

    private def result_json_string
      response
        .parsed_response['choices']
        &.first
        &.dig('message', 'content')
    end

    def endpoint = ENDPOINT

    def messages = [system_message]

    def request_body
      {
        model: MODEL,
        messages: messages,
        n: 1,
        response_format: RESPONSE_FORMAT
      }
    end
  end
end
