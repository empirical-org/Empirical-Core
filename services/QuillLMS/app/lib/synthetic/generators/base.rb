module Synthetic
  module Generators
    class Base < ApplicationService

      class NotImplementedError < StandardError; end

      attr_reader :results_hash, :languages

      # takes an array of unique strings ['string1 data sample', 'sample 2']
      # returns a hash of the form:
      # {'string1 data sample' => {'es' => 'hola, amigo', 'ko' => 'translated to korean'}, 'sample 2' =>...}
      def initialize(string_array, options = {})
        # create and hash with each string  to an empty hash, e.g.
        # {'string' => {}, 'string 2' => {}
        @results_hash = Hash[string_array.map {|string| [string,{}] }]
        @languages = options[:languages] || Synthetic::Generators::Translation::TRAIN_LANGUAGES
      end

      def run
        generate

        results_hash
      end

      # sub classes are required to have one public method called 'generate'
      def generate
        raise NotImplementedError
      end

      private def strings
        results_hash.keys
      end
    end
  end
end
