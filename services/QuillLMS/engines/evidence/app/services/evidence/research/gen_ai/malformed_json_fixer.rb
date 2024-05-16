# frozen_string_literal: true

require 'parslet'

module Evidence
  module Research
    module GenAI
      class MalformedJSONFixer < ApplicationService
        attr_reader :raw_text

        def initialize(raw_text:)
          @raw_text = raw_text
        end

        def run
          JSON.parse(raw_text).to_json
        rescue JSON::ParserError
          cleaned_text
        rescue Parslet::ParseFailed => e
          raise e.parse_failure_cause.ascii_tree
        end

        private def cleaner = @cleaner ||= JSONCleaner.new
        private def cleaned_text = cleaner.apply(parsed_text)
        private def parser = @parser ||= MalformedJSONParser.new
        private def parsed_text = parser.parse(raw_text)
      end

      class MalformedJSONParser < Parslet::Parser
        # The JSON grammar is more complex than this but we're simplifying to handle the cases we've seen
        root(:object)

        rule(:object) { (left_brace >> (key_value >> (comma >> key_value).repeat).maybe.as(:object) >> right_brace) }

        rule(:key_value) { string.as(:key) >> colon >> string.as(:val) }

        # The JSON string grammar allows for any character except " and control characters but we're simplifying here
        # to allow only alphanumeric characters and underscores which is what we've seen thus far from the LLM
        rule(:string) { quote.maybe >> alpha_numeric_underscores.as(:string) >> quote.maybe }

        rule(:alpha_numeric_underscores) { match('[a-zA-Z0-9_ ]').repeat(1) }
        rule(:comma) { spaces? >> str(',') >> spaces? }
        rule(:colon) { spaces? >> str(':') >> spaces? }
        rule(:quote) { spaces? >> str('"') >> spaces? }
        rule(:left_brace) { spaces? >> str('{') >> spaces? }
        rule(:right_brace) { spaces? >> str('}') >> spaces? }

        rule(:spaces?) { spaces.maybe }
        rule(:spaces) { match('\s').repeat(1) }
      end

      class JSONCleaner < Parslet::Transform
        rule(string: simple(:x)) { String(x).strip }
        rule(key: simple(:k), val: simple(:v)) { { k => v } }
        rule(object: subtree(:x)) { x.reduce({}, :merge).to_json }
      end
    end
  end
end
