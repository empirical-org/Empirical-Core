# frozen_string_literal: true

module Evidence
  module OpenAI
    class Translate < Evidence::ApplicationService
      include Evidence::OpenAI::Concerns::Api
      PROMPT_START = <<~STRING
        can you translate the following phrase from english into latin american spanish for me? Please return just the translated text preserving (but not translating) the HTML. We are translating the instructions for an English-language grammar activity. The content of the activity itself is not translated. Therefore, please leave words that sound like they are part of the activity in the original english. Often they will between an HTML tag such as in <em>english word</em> or <ul>english word</ul>.
        Here is what I want translated:

      STRING

      ENDPOINT = '/chat/completions'
      MODEL = 'gpt-4-turbo'

      KEY_ROLE = "role"
      KEY_CONTENT = "content"
      ROLE_SYSTEM = "system"
      ROLE_USER = "user"
      ROLE_ASSISTANT = "assistant"
      RESPONSE_FORMAT = { "type" => "text" }
      attr_reader :english_text, :system_prompt

      def initialize(english_text:)
        @english_text = english_text
        prompt = PROMPT_START + english_text
        @system_prompt = prompt
      end

      private def system_message = {KEY_ROLE => ROLE_SYSTEM, KEY_CONTENT => system_prompt}

      def cleaned_results
        return nil if response&.body&.nil?

        result_json_string
      end

      private def result_json_string
        response
          .parsed_response['choices']
          .map{|r| r['message']['content'] }
          .first
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
end
