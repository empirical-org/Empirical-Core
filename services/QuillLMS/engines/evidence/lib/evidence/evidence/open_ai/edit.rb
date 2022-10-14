# frozen_string_literal: true

module Evidence
  module OpenAI
    class Edit < Evidence::ApplicationService
      include Evidence::OpenAI::Concerns::API
      include Evidence::OpenAI::Concerns::SentenceResults

      ENDPOINT = '/edits'

      # Undocumented, but I believe this is the only model
      # available for the Edit endpoint
      MODEL = 'text-davinci-edit-001'

      DEFAULT_INSTRUCTION = "Paraphrase the text"

      attr_reader :input, :instruction, :temperature, :count

      def initialize(input:, instruction: DEFAULT_INSTRUCTION, temperature: 0.5, count: 1)
        @input = input
        @instruction = instruction
        @temperature = temperature
        @count = count
      end

      def endpoint
        ENDPOINT
      end

      # https://beta.openai.com/docs/api-reference/edits/create
      def request_body
        {
          model: MODEL,
          temperature: temperature,
          input: input,
          instruction: instruction,
          n: [count.to_i, Evidence::OpenAI::MAX_COUNT].min,
        }
      end
    end
  end
end
