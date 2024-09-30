# frozen_string_literal: true

require 'neighbor'

module Evidence
  module GenAI
    module LabelFeedback
      class Retriever < ApplicationService
        API = Evidence::Gemini::Chat
        KEY_LABEL = 'label'
        MATCH_THRESHOLD = 0.03
        LOW_EXAMPLE_AMOUNT = 5
        NEARBY_THRESHOLD = 0.08
        HIGH_EXAMPLE_AMOUNT = 5

        Result = Data.define(:label, :closest_distance)

        attr_reader :prompt, :entry

        def initialize(prompt:, entry:)
          @prompt = prompt
          @entry = entry
        end

        def run
          closest_distance = closest_example.neighbor_distance
          puts closest_distance
          if closest_distance <= MATCH_THRESHOLD
            puts 'under threshold'
            return Result.new(label: closest_example.label_transformed, closest_distance:)
          end

          limit = closest_distance <= NEARBY_THRESHOLD ? LOW_EXAMPLE_AMOUNT : HIGH_EXAMPLE_AMOUNT
          puts limit

          response = API.run(system_prompt: system_prompt(limit), entry:)

          Result.new(label: response[KEY_LABEL], closest_distance:)
        end

        private def closest_example
          @closest_example ||= Evidence::PromptResponse.closest_prompt_texts(prompt.id, entry, 1).first
        end

        private def system_prompt(limit) = Evidence::GenAI::LabelFeedback::PromptBuilder.run(prompt:, entry:, options: {limit:})
      end
    end
  end
end
