module Evidence
  module Opinion 
    class Client
      API_TIMEOUT = 5
      ALLOWED_PAYLOAD_KEYS = ['rule_uid', 'highlight']

      def initialize(entry:, prompt_text:)
        @entry = entry
        @prompt_text = prompt_text
      end

      def post
        Timeout.timeout(API_TIMEOUT) do 
          HTTParty.post(
            ENV['OPINION_API_DOMAIN'], 
            headers:  {'Content-Type': 'application/json'},
            body:     {
              entry: @entry,
              prompt_text: @prompt_text
            }.to_json
          )
          .filter { |k,v| ALLOWED_PAYLOAD_KEYS.include?(k) }
        end
      end
    end
    
  end
end


