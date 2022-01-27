# frozen_string_literal: true

module Evidence
  module Grammar
    class Client
      API_TIMEOUT = 500
      ALLOWED_PAYLOAD_KEYS = ['gapi_error', 'highlight']

      class GrammarApiError < StandardError; end

      def initialize(entry:, prompt_text:)
        @entry = entry
        @prompt_text = prompt_text
      end

      def post
        Timeout.timeout(API_TIMEOUT) do 
          response = HTTParty.post(
            ENV['GRAMMAR_API_DOMAIN'], 
            headers:  {'Content-Type': 'application/json'},
            body:     {
              entry: @entry,
              prompt_text: @prompt_text
            }.to_json
          )
          if !response.success? 
            raise GrammarApiError, "Encountered upstream error: #{response}"
          end

          response.filter { |k,v| ALLOWED_PAYLOAD_KEYS.include?(k) }
        end
      end
    end
    
  end
end


