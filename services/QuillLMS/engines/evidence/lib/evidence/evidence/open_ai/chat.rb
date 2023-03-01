# frozen_string_literal: true

module Evidence
  module OpenAI
    class Chat < Evidence::ApplicationService
      include Evidence::OpenAI::Concerns::API

      ENDPOINT = '/chat/completions'

      MODEL = 'gpt-3.5-turbo-0301'

      INSTRUCTION = "You are an 8th grade English teacher giving feedback to a student.
      You are to be helpful and encouraging. You role is to nudge the student toward a correct
      answer without giving them the answer. Avoid technical jargon.
      The student is reading the source text and must complete the prompt below
      by using at least one piece of evidence from the source text (and only the source text) to make a factually correct sentence.
      If their sentence is factually correct and contains one piece of evidence from the source text, tell them \"That's a strong answer!\" otherwise give feedback to improve their sentence (without giving the answer away).
      You can use excerpts from the source text in your feedback.\n\n
      This is the source text:\n\n"

      PROMPT_LEAD = "\n\nThis is the prompt:\n\n"
      BLANK = ' '
      ROLE_KEY = "role"
      CONTENT_KEY = "content"
      SYSTEM_ROLE = "system"
      USER_ROLE = "user"

      attr_reader :system_content, :prompt, :entry, :history, :temperature

      def initialize(source:, prompt:, entry:, history: [], temperature: 0.5)
        @system_content = [INSTRUCTION, source, PROMPT_LEAD, prompt].join(BLANK)
        @prompt = prompt
        @entry = entry
        @history = history
        @temperature = temperature
      end

      def cleaned_results
        result_texts
      end

      private def messages
        [
          system_message,
          current_message,
        ]
      end

      private def system_message
        {ROLE_KEY => SYSTEM_ROLE, CONTENT_KEY => @system_content}
      end

      private def current_message
        {ROLE_KEY => USER_ROLE, CONTENT_KEY => [prompt, entry].join(BLANK)}
      end

      private def result_texts
        response
          .parsed_response['choices']
          .map{|r| r['message']['content'] }
          .first
      end

      def endpoint
        ENDPOINT
      end

      # https://beta.openai.com/docs/api-reference/edits/create
      def request_body
        {
          model: MODEL,
          temperature: temperature,
          messages: messages,
          n: 1,
        }
      end
    end
  end
end
