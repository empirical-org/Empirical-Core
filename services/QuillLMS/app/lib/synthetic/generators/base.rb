# frozen_string_literal: true

module Synthetic
  module Generators
    class Base < ApplicationService

      class NotImplementedError < StandardError; end

      attr_reader :results_hash

      # takes an array of unique strings, e.g. ['original string', 'sample 2']
      def initialize(string_array, options = {})
        # create and hash with each string  to an empty hash, e.g.
        # {'string' => {}, 'string 2' => {}
        @results_hash = string_array.map {|string| [string,{}] }.to_h
      end

      # returns a hash of the form:
      # {'original string' => {'transform_key' => 'generated string', 'transform_key2' => 'generated string2'}, 'sample 2' =>...}
      # examples:
      # {'hello' => {'es' => 'greetings', 'ko' => 'hi'}, 'sample 2' =>...}
      # {'their happy' => {'their' => 'ther happy'}, 'sample 2' =>...}
      def run
        generate

        results_hash
      end

      # sub classes are required to have one public method called 'generate'
      # to populate 'results_hash' from data generated from 'strings'
      def generate
        raise NotImplementedError
      end

      private def strings
        results_hash.keys
      end
    end
  end
end
