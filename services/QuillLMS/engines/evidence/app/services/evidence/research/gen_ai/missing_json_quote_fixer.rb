# frozen_string_literal: true
# frozen_string_literal: true

require 'parslet'

module Evidence
  module Research
    module GenAI
      class MissingJSONQuoteFixer < ApplicationService
        LINE_AND_COLUMN_NUMBERS_REGEX = /at line (\d+), column (\d+)/

        attr_reader :raw_text

        def initialize(raw_text:)
          @raw_text = raw_text
        end

        def run
          JSON.parse(raw_text)
        rescue JSON::ParserError
          fix_json(raw_text)
        end

        private def fix_json(json)
          parsed = parser.parse(json)
          result = cleaner.apply(parsed)
          binding.pry
        rescue Parslet::ParseFailed => e
          puts e.parse_failure_cause.ascii_tree
        end

        private def parser = @parser ||= JSONParser.new
        private def cleaner = @cleaner ||= JSONCleaner.new
      end

      class JSONParser < Parslet::Parser
        root :object_wrapper

        rule(:object_wrapper) { spaces? >> str('{') >> spaces? >> object >> spaces? >> str('}') >> spaces? }
        rule(:object)         { pair >> (spaces? >> str(',') >> spaces? >> pair).repeat }

        rule(:pair)           { stringy.as(:key) >> spaces? >> str(':') >> value }

        rule(:value)          { spaces? >> (stringy | number | object_wrapper | array | true_value | false_value | null_value) >> spaces? }

        rule(:spaces)         { match('\s').repeat(1) }
        rule(:spaces?)        { spaces.maybe }

        rule(:stringy)        { string_without_leading_or_trailing_quote | string_without_leading_quote | string_without_trailing_quote | string  }
        rule(:string)         { str('"') >> alnum_underscores >> str('"') }
        rule(:string_without_leading_quote) { alnum_underscores.as(:string_without_leading_quote) >> str('"') }
        rule(:string_without_trailing_quote) { str('"') >> alnum_underscores.as(:string_without_trailing_quote) }
        rule(:string_without_leading_or_trailing_quote) { alnum_underscores.as(:string_without_leading_or_trailing_quote) }

        rule(:alnum_underscores) { match('[a-zA-Z0-9_]').repeat(1) }

        rule(:number)         { (str('-').maybe >> digits >> (str('.') >> digits).maybe >> (match('[eE]') >> match('[+-]').maybe >> digits).maybe).as(:number) }
        rule(:digits)         { match('[0-9]').repeat(1) }

        rule(:true_value)     { str('true').as(:true) }
        rule(:false_value)    { str('false').as(:false) }
        rule(:null_value)     { str('null').as(:null) }

        rule(:array)          { str('[') >> spaces? >> (value >> (spaces? >> str(',') >> spaces? >> value).repeat).maybe >> spaces? >> str(']') >> spaces? }
      end

      class JSONCleaner < Parslet::Transform
        rule(number: simple(:x))  { Float(x) }
        rule(true: simple(:x))    { true }
        rule(false: simple(:x))   { false }
        rule(null: simple(:x))    { nil }
        rule(string: simple(:x))  { String(x) }
        rule(key: simple(:k), value: simple(:v)) { { k.to_s => v } }
        rule(key: simple(:k), value: subtree(:v)) { { k.to_s => v } }
        rule(array: subtree(:x))  { Array(x) }
        rule(object: subtree(:x)) { x.reduce({}, :merge) }

        rule(string_without_leading_quote: simple(:x)) { "\"#{String(x)}" }
        rule(string_without_trailing_quote: simple(:x)) { "#{String(x)}\"" }
        rule(string_without_leading_or_trailing_quote: simple(:x)) { "\"#{String(x)}\"" }
      end


      # class JSONTransform < Parslet::Transform
      #   rule(number: simple(:x))  { Float(x) }
      #   rule(true: simple(:x))    { true }
      #   rule(false: simple(:x))   { false }
      #   rule(null: simple(:x))    { nil }
      #   rule(string: simple(:x))  { String(x) }
      #   rule(key: simple(:k), value: simple(:v)) { { k.to_s => v } }
      #   rule(key: simple(:k), value: subtree(:v)) { { k.to_s => v } }
      #   rule(array: subtree(:x))  { Array(x) }
      #   rule(object: subtree(:x)) { x.reduce({}, :merge) }
      # end

      # # Example usage
      # parser = JSONParser.new
      # transform = JSONTransform.new

      # json = '{"name": "John", "age": 30, "is_student": false, "courses": ["Math", "Science"], "address": {"city": "New York", "zipcode": "10001"}, "null_value": null, invalid_key: "missing_leading_quote}'
      # begin
      #   # Use a custom error reporter
      #   reporter = Parslet::ErrorReporter::Deepest.new
      #   parsed = parser.parse_with_debug(json, reporter: reporter)
      #   result = transform.apply(parsed)
      #   puts result
      # rescue Parslet::ParseFailed => e
      #   puts "Parse failed:"
      #   puts e.parse_failure_cause.ascii_tree
      # end
    end
  end
end



# require 'oj'

# module Evidence
#   module Research
#     module GenAI
# #       class MissingJSONQuoteFixer < ApplicationService

#         OJ_MODE = :strict
#         LINE_AND_COLUMN_NUMBERS_REGEX = /at line (\d+), column (\d+)/
#         QUOTE = '"'

#         attr_reader :raw_text

#         def initialize(raw_text:)
#           @raw_text = raw_text
#         end

#         def run
#           json = insert_missing_quotes(raw_text)
#           Oj.load(json, mode: OJ_MODE)
#           json
#         rescue Oj::ParseError => e
#           raise "Failed to parse JSON: #{e.message}"
#         end

#         private def insert_missing_quotes(json, last_error = nil)
#           Oj.load(json, mode: OJ_MODE)
#           json
#         rescue Oj::ParseError => e
#           error = get_json_parse_error(json, e)
#           binding.pry

#           raise e unless error && error[:message].include?('unexpected character')

#           raise e if last_error && same_error?(last_error, error)

#           return insert_missing_quotes(insert_quote(json, error[:line_num] - 1, error[:column_num] - 1), error)

#           raise e
#         end

#         private def get_json_parse_error(json, error)
#           line_num, column_num = extract_line_and_column_numbers(error.message)
#           {
#             column_num:,
#             line_num:,
#             message: error.message.split("\n", 1)&.first,
#             snippet: json.lines[line_num - 1]
#           }
#         end

#         private def extract_line_and_column_numbers(message)
#           message =~ LINE_AND_COLUMN_NUMBERS_REGEX ? [::Regexp.last_match(1).to_i, ::Regexp.last_match(2).to_i] : [0, 0]
#         end

#         private def insert_quote(json, line_num, column_num)
#           lines = json.lines
#           lines[line_num] = lines[line_num].insert(column_num, QUOTE)
#           binding.pry
#           lines.join
#         end

#         private def same_error?(error1, error2)
#           error1[:message] == error2[:message] &&
#           error1[:column_num] == error2[:column_num] &&
#           error1[:line_num] == error2[:line_num]
#         end
#       end
#     end
#   end
# end
