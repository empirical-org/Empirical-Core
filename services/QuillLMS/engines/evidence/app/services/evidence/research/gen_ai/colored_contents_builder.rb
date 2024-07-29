# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class ColoredContentsBuilder < ApplicationService
        ACTIVITY_COLOR = 'red'
        GENERAL_COLOR = 'blue'

        attr_reader :contents

        def initialize(contents:)
          @contents = contents
        end

        def run
          activity_colored = replace_with_color(ACTIVITY_COLOR, activity_substitutions, contents)
          general_colored = replace_with_color(GENERAL_COLOR, general_substitutions, activity_colored)
          general_colored.gsub("\n", '<br>')
        end

        private def activity_substitutions = LLMPromptBuilder.activity_substitutions
        private def general_substitutions = PromptTemplateVariable.general_substitutions

        private def replace_with_color(color, substitutions, text)
          substitutions.reduce(text) do |current_text, substitution|
            current_text.gsub(substitution, "<span style='color: #{color};'>#{substitution}</span>")
          end
        end
      end
    end
  end
end
