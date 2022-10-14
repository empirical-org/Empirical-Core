# frozen_string_literal: true

module Evidence
  module OpenAI
    module Concerns::SentenceResults
      extend ActiveSupport::Concern

      BLANK = ''

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
