# frozen_string_literal: true

module Evidence
  module OpenAI
    class Chat < Evidence::ApplicationService
      include Evidence::OpenAI::Concerns::Api

      ENDPOINT = '/chat/completions'

      DEFAULT_MODEL = 'gpt-4-turbo'
      SMALL_MODEL = 'gpt-4o-mini'

      KEY_ROLE = 'role'
      KEY_CONTENT = 'content'
      ROLE_SYSTEM = 'system'
      ROLE_USER = 'user'
      ROLE_ASSISTANT = 'assistant'
      RESPONSE_FORMAT = { 'type' => 'json_object' }

      attr_reader :system_prompt, :entry, :history, :temperature, :model

      def initialize(system_prompt:, entry:, history: [], temperature: 1, model: DEFAULT_MODEL)
        @system_prompt = system_prompt
        @entry = entry
        @history = history
        @temperature = temperature
        @model = model
      end

      private def messages = [system_message, history_messages, current_message].flatten

      private def system_message = { KEY_ROLE => ROLE_SYSTEM, KEY_CONTENT => system_prompt }
      private def current_message = { KEY_ROLE => ROLE_USER, KEY_CONTENT => entry }

      private def history_messages
        history.map do |h|
          [
            { KEY_ROLE => ROLE_USER, KEY_CONTENT => h.user },
            { KEY_ROLE => ROLE_ASSISTANT, KEY_CONTENT => h.assistant }
          ]
        end.flatten
      end

      def cleaned_results
        return nil if response&.body.nil?

        @cleaned_results ||= JSON.parse(result_json_string)
      end

      private def result_json_string
        response
          .parsed_response['choices']
          .map { |r| r['message']['content'] }
          .first
      end

      def endpoint = ENDPOINT
      def response_format = RESPONSE_FORMAT

      # https://platform.openai.com/docs/api-reference/chat/create
      def request_body = { model:, temperature:, messages:, response_format: }
    end
  end
end
