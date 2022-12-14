# frozen_string_literal: true

module Evidence
  module Synthetic
    module Generators
      class Paraphrase < Synthetic::Generators::Base
        COUNT = 4
        TEMPERATURE = 0.6

        attr_reader :passage

        def initialize(string_array, options = {})
          super

          @passage = HTMLTagRemover.run(options[:passage] || "")
        end

        def generate
          strings.each do |string|
            results = api_results(string)
              .map {|s| lowercaser.run(s) }

            # convert array to {'index' => item} hash to fit protocol
            result_hash = results
              .map.with_index {|a,i| [i.to_s,a]}
              .to_h

            results_hash[string] = result_hash
          end
        end

        private def api_results(string)
          prompt = Evidence::OpenAI::PARAPHRASE_INSTRUCTION + string

          Evidence::OpenAI::Completion.run(prompt: prompt, count: COUNT, temperature: TEMPERATURE)
        end

        private def lowercaser
          @lowercaser ||= Evidence::SafeFirstLowercaser.new(passage)
        end
      end
    end
  end
end
