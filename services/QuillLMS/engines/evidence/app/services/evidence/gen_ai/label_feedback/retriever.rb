# frozen_string_literal: true

require 'neighbor'

module Evidence
  module GenAI
    module LabelFeedback
      class Retriever < ApplicationService
        API = Evidence::Gemini::Chat
        KEY_LABEL = 'label'
        THRESHOLD = 0.05

        attr_reader :prompt, :entry

        def initialize(prompt:, entry:)
          @prompt = prompt
          @entry = entry
        end

        def run
          puts closest_example.neighbor_distance
          if closest_example.neighbor_distance <= THRESHOLD
            puts 'under threshold'
            return closest_example.label_transformed
          end

          response = API.run(system_prompt:, entry:)

          response[KEY_LABEL]
        end

        private def closest_example = closest_examples.first
        private def closest_examples = prompt_builder.rag_examples
        private def system_prompt = prompt_builder.run

        private def prompt_builder
          @prompt_builder ||= Evidence::GenAI::LabelFeedback::PromptBuilder.new(prompt:, entry:)
        end
      end
    end
  end
end
