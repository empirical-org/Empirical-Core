# frozen_string_literal: true

module Evidence
  module Synthetic
    module Generators
      class Paraphrase < Synthetic::Generators::Base
        COUNT = 4
        TEMPERATURE = 0.7

        attr_reader :passage

        def initialize(string_array, options = {})
          super

          @passage = HTMLTagRemover.run(options[:passage] || "")
        end

        def generate
          strings.each do |string|
            results = api_results(string)
              .map {|s| lowercaser.run(s) }
              .uniq

            generator = Evidence::Synthetic::Generator.new(
              name: 'LabelParaphrase',
              source_text: string,
              temperature: TEMPERATURE,
              ml_prompt: ml_prompt(string),
              count: COUNT,
              results: results
            )

            results_hash[string].append(generator)
          end
        end

        private def api_results(string)
          Evidence::OpenAI::Completion.run(
            prompt: ml_prompt(string),
            count: COUNT,
            temperature: TEMPERATURE
          )
        end

        private def ml_prompt(string)
          Evidence::OpenAI::PARAPHRASE_INSTRUCTION + string
        end

        private def lowercaser
          @lowercaser ||= Evidence::SafeFirstLowercaser.new(passage)
        end
      end
    end
  end
end
