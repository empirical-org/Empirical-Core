# frozen_string_literal: true

require 'parslet'

module Evidence
  module Research
    module GenAI
      class MalformedJSONFixer < ApplicationService
        attr_reader :text

        def initialize(text:)
          @text = text
        end

        def run
          JSON.parse(text).to_json
        rescue JSON::ParserError
          cleaned_text
        end

        private def cleaned_text
          cleaner.apply(parsed_text).to_json
        rescue Parslet::ParseFailed => e
          raise e.parse_failure_cause.ascii_tree
        end

        private def cleaner = JSONCleaner.new
        private def parser = MalformedJSONParser.new
        private def parsed_text = parser.parse(text)
      end

      class MalformedJSONParser < Parslet::Parser
        # The JSON grammar is more complex than this but we're simplifying to handle the cases we've seen
        root(:object)

        rule(:object) { (left_brace >> (key_val >> (comma >> key_val).repeat).as(:object) >> right_brace) }

        rule(:key_val) { string.as(:key) >> colon >> value.as(:val) }
        rule(:value) { string | object }

        # The JSON string grammar allows for any character except " and control characters but we're simplifying here
        # to allow only alphanumeric characters and underscores which is what we've seen thus far from the LLM
        rule(:string) { quote.maybe >> alnum_or_underscores.as(:string) >> quote.maybe }

        rule(:alnum_or_underscores) { (match['[:alnum:]'] | str('_')).repeat(1) }
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
        rule(key: simple(:k), val: subtree(:v)) { { k => v } }
        rule(object: subtree(:x)) { x.is_a?(Array) ? x.reduce({}, :merge) : x }
      end
    end
  end
end
