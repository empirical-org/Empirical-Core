# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class LLMAssignedStatusResolver < ApplicationService
        class ResolverError < StandardError; end
        class NilRawTextError < ResolverError; end
        class BlankRawTextError < ResolverError; end
        class MissingBooleanValueError < ResolverError; end
        class MissingOptimalKeyError < ResolverError; end
        class RawTextIsNotHashError < ResolverError; end
        class InvalidJSONError < ResolverError; end

        OPTIMAL = HasAssignedStatus::OPTIMAL
        SUBOPTIMAL = HasAssignedStatus::SUBOPTIMAL
        UNKNOWN_STATUS = 'unknown'

        attr_reader :raw_text

        def initialize(raw_text:)
          @raw_text = raw_text
        end

        def run
          validate_raw_text
          extract_assigned_status
        end

        private def validate_raw_text
          raise NilRawTextError if raw_text.nil?
          raise BlankRawTextError if raw_text.blank?
          raise RawTextIsNotHashError unless data.is_a?(Hash)
        end

        private def data
          @data ||= JSON.parse(raw_text)
        rescue JSON::ParserError
          raise InvalidJSONError
        end

        private def extract_assigned_status
          raise MissingOptimalKeyError unless data.key?('optimal')
          raise MissingBooleanValueError unless data['optimal'].in?([true, false])

          data['optimal'] ? OPTIMAL : SUBOPTIMAL
        end
      end
    end
  end
end
