
module Evidence
  module OpenAI
    module APIConcern
      extend ActiveSupport::Concern

      BLANK = ''

      included do
        include HTTParty
        base_uri 'https://api.openai.com/v1'

        attr_accessor :response
        attr_reader :response_body, :endpoint
      end

      def run
        return response if response.present?

        @response = self.class.post(endpoint, body: request_body.to_json, headers: headers)

        cleaned_results
      end

      def headers
        {
          "Content-Type" => "application/json",
          "Authorization" => "Bearer #{Evidence::OpenAI::API_KEY}"
        }
      end

      def cleaned_results
        result_texts_removed_characters
          .map{|r| r&.split(/\n/)&.first } # drop anything after a \n
          .map{|r| r&.strip } # remove leading/ending spaces
          .compact
          .select {|r| r.length >= 10}
          .uniq
      end

      def result_texts_removed_characters
        result_texts
          .map{|r| r&.gsub(/^(\n|-|\s)+/, BLANK)} # strip all leading \n, -, or whitespace
          .map{|r| r&.gsub(/(\]|\[|=|\d\))/, BLANK)} # strip brackets, equal signs, and 1), 2)
      end

      private def result_texts
        response
          .parsed_response['choices']
          .map{|r| r['text']}
      end
    end
  end
end
