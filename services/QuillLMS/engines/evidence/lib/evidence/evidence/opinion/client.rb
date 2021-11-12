module Evidence
  module Opinion 
    class Client
      API_TIMEOUT = 500
      ALLOWED_PAYLOAD_KEYS = ['oapi_error', 'highlight']

      class OpinionAPIError < StandardError; end

      def initialize(entry:, prompt_text:)
        @entry = entry
        @prompt_text = prompt_text
      end

      def post
        Timeout.timeout(API_TIMEOUT) do 
          response = HTTParty.post(
            ENV['OPINION_API_DOMAIN'], 
            headers:  {'Content-Type': 'application/json'},
            body:     {
              entry: @entry,
              prompt_text: @prompt_text
            }.to_json
          )
          if !response.success? 
            raise OpinionAPIError, "Encountered upstream error: #{response}"
          end
          response.filter { |k,v| ALLOWED_PAYLOAD_KEYS.include?(k) }
        end
      end
    end
    
  end
end


