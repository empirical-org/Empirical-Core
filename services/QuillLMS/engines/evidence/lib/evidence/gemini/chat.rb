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

      def cleaned_results
        return nil if response&.body.nil?

        @cleaned_results ||= result_json
      end

      private def result_json
        JSON.parse(result_json_string)
      rescue => e
        raise CleanedResultsError, e.message
      end

      private def result_json_string
        response
          .parsed_response['candidates']
          .first
          .dig('content', 'parts')
          .first['text']
      end

      def body = request_body.to_json

      def request_body
        {
          system_instruction:,
          contents:,
          generationConfig: generation_config,
          safety_settings:
        }
      end

      private def system_instruction = { KEY_PARTS => { KEY_TEXT => system_prompt } }
      private def contents = [history_messages, current_message].flatten
      private def current_message = { KEY_ROLE => ROLE_USER, KEY_PARTS => [{ KEY_TEXT => entry }] }

      private def history_messages
        history.map do |h|
          [
            { KEY_ROLE => ROLE_USER, KEY_PARTS => [{ KEY_TEXT => h.user }] },
            { KEY_ROLE => ROLE_ASSISTANT, KEY_PARTS => [{ KEY_TEXT => h.assistant }] }
          ]
        end.flatten
      end

      private def generation_config = { temperature:, response_mime_type:}

      private def response_mime_type = 'application/json'
      private def model_version = model
      private def instruction = GENERATE_CONTENT
    end
  end
end
