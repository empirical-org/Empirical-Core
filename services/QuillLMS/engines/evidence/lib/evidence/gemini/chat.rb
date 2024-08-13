# frozen_string_literal: true

module Evidence
  module Gemini
    class Chat < Evidence::ApplicationService
      include Evidence::Gemini::Concerns::Api

      GENERATE_CONTENT = 'generateContent'
      DEFAULT_MODEL = 'gemini-1.5-flash-latest'
      SMALL_MODEL = DEFAULT_MODEL

      KEY_ROLE = 'role'
      KEY_PARTS = 'parts'
      KEY_TEXT = 'text'
      ROLE_USER = 'user'
      ROLE_ASSISTANT = 'model'

      attr_reader :system_prompt, :entry, :history, :temperature, :model

      def initialize(system_prompt:, entry:, history: [], temperature: 1, model: DEFAULT_MODEL)
        @system_prompt = system_prompt
        @entry = entry
        @history = history
        @temperature = temperature
        @model = model
      end

      def request_body
        {
          system_instruction: system_instructions,
          contents: messages,
          generationConfig: generation_config,
          safety_settings: SAFETY_SETTINGS
        }
      end

      def body = request_body.to_json

      private def system_instructions = {KEY_PARTS => {KEY_TEXT => system_prompt}}
      private def messages = [history_messages, current_message].flatten
      private def current_message = { KEY_ROLE => ROLE_USER, KEY_PARTS => [{KEY_TEXT => entry}] }

      private def history_messages
        history.map do |h|
          [
            { KEY_ROLE => ROLE_USER, KEY_PARTS => [{KEY_TEXT => h.user}] },
            { KEY_ROLE => ROLE_ASSISTANT, KEY_PARTS => [{KEY_TEXT => h.assistant}] }
          ]
        end.flatten
      end

      private def generation_config
        {
          'temperature' => temperature,
          'responseMimeType': 'application/json'
        }
      end

      private def model_version = model

      private def instruction = GENERATE_CONTENT

      def cleaned_results
        return nil if response&.body&.nil?

        @cleaned_results ||= JSON.parse(result_json_string)
      end

      private def result_json_string
        response
          .parsed_response['candidates']
          .first
          .dig('content', 'parts')
          .first['text']
      rescue => e
        raise CleanedResultsError, e.message
      end
    end
  end
end
