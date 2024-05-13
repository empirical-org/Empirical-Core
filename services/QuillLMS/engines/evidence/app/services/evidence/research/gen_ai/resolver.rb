# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class Resolver < ApplicationService
        attr_reader :raw_text

        class ResolverError < StandardError; end
        class NilFeedbackError < ResolverError; end
        class EmptyFeedbackError < ResolverError; end
        class BlankTextError < ResolverError; end
        class InvalidJSONError < StandardError; end

        def initialize(raw_text:)
          @raw_text = raw_text
        end

        def run
          raise NilFeedbackError if raw_text.nil?
          raise EmptyFeedbackError if raw_text.empty?

          simple_feedback || enumerated_feedback || raw_text
        end

        private def data
          @data ||= JSON.parse(raw_text)
        rescue JSON::ParserError
          raise InvalidJSONError, "Invalid JSON provided: '#{raw_text}'"
        end

        private def simple_feedback
          data['feedback']
        end

        private def enumerated_feedback
          data.dig('properties', 'feedback', 'enum').join(' ')
        end
      end
    end
  end
end
