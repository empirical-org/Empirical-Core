# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class Resolver < ApplicationService
        attr_reader :feedback

        FEEDBACK_MARKER = 'Feedback:'

        def initialize(feedback:)
          @feedback = feedback
        end

        def run
          return nil if feedback.nil?
          return feedback if feedback_index.nil?

          feedback[feedback_index + FEEDBACK_MARKER.length..].strip
        end

        private def feedback_index = feedback.index(FEEDBACK_MARKER)
      end
    end
  end
end
