# frozen_string_literal: true

module Evidence
  module OpenAI
    class ChatWithHistory < Evidence::ApplicationService
      include Evidence::OpenAI::Concerns::Api

      ENDPOINT = '/chat/completions'

      MODEL = 'gpt-4-turbo'

      BLANK = ' '
      KEY_ROLE = "role"
      KEY_CONTENT = "content"
      ROLE_SYSTEM = "system"
      ROLE_USER = "user"
      ROLE_ASSISTANT = "assistant"
      RESPONSE_FORMAT = { "type" => "json_object" }

      KEY_FEEDBACK = 'feedback'
      KEY_OPTIMAL = 'optimal'

      attr_reader :system_prompt, :current_entry, :history, :temperature

      def initialize(system_prompt:, current_entry:, history: [], temperature: 0.5)
        @system_prompt = system_prompt
        @current_entry = current_entry
        @history = history
        @temperature = temperature
      end

      def cleaned_results = feedback

      private def messages = [system_message, history_messages, current_message].flatten

      private def system_message = {KEY_ROLE => ROLE_SYSTEM, KEY_CONTENT => system_prompt}
      private def current_message = {KEY_ROLE => ROLE_USER, KEY_CONTENT => current_entry}

      private def history_messages
        history.map do |h|
          [
            {KEY_ROLE => ROLE_USER, KEY_CONTENT => h.entry },
            {KEY_ROLE => ROLE_ASSISTANT, KEY_CONTENT => h.feedback_text},
          ]
        end.flatten
      end

      def result
        @result ||= JSON.parse(result_json_string)
      end

      private def result_json_string
        response
          .parsed_response['choices']
          .map{|r| r['message']['content'] }
          .first
      end

      private def feedback = result[KEY_FEEDBACK]

      def endpoint = ENDPOINT

      def optimal?
        return false unless response.present?

        result[KEY_OPTIMAL]
      end

      # https://platform.openai.com/docs/api-reference/chat/create
      def request_body
        {
          model: MODEL,
          temperature: temperature,
          messages: messages,
          n: 1,
          response_format: RESPONSE_FORMAT
        }
      end
    end
  end
end
