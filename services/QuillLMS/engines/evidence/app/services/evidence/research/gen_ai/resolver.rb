# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class Resolver < ApplicationService
        attr_reader :feedback

        class ResolverError < StandardError; end
        class NilFeedbackError < ResolverError; end
        class EmptyFeedbackError < ResolverError; end
        class BlankTextError < ResolverError; end

        FEEDBACK_MARKER = 'Feedback:'

        def initialize(feedback:)
          @feedback = feedback
        end

        def run
          raise NilFeedbackError if feedback.nil?
          raise EmptyFeedbackError if feedback.empty?

          extract_feedback_content
        end

        private def feedback_index = feedback.index(FEEDBACK_MARKER)

        private def extract_feedback_content
          return feedback if feedback_index.nil?

          content_start = feedback_index + FEEDBACK_MARKER.length
          feedback_content = feedback[content_start..].strip

          raise BlankTextError, "Feedback provided: '#{feedback}'" if feedback_content.blank?

          feedback_content
        end
      end
    end
  end
end
