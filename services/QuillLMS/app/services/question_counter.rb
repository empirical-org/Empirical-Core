# frozen_string_literal: true

class QuestionCounter < ApplicationService
  attr_reader :activity, :tool_key

  PROOFREADER_REGEX = ::Regexp.new(/\{(\+|\-)/)
  LESSONS_COUNTS = Configs[:lessons_question_counts]

  TOOL_CALCULATORS = {
    passage:    -> (a) { a.data.dig('passage')&.scan(PROOFREADER_REGEX)&.size},
    sentence:   -> (a) { grammar_calculator(a) },
    connect:    -> (a) { a.data.dig('questions')&.size },
    diagnostic: -> (a) { a.data.dig('questions')&.size },
    lessons:    -> (a) { LESSONS_COUNTS.dig(a.uid) },
    evidence:   -> (_) { 3 }
  }
  TOOL_DEFAULTS = {
    passage: 10,
    sentence: 10,
    connect:  10,
    diagnostic: 25,
    lessons:  5,
    evidence: 3
  }
  DEFAULT = 10

  def initialize(activity)
    @activity = activity
    @tool_key = activity&.classification&.key&.to_sym
  end

  def run
    TOOL_CALCULATORS[tool_key]&.call(activity) ||
      TOOL_DEFAULTS[tool_key] ||
      DEFAULT
  end

  def self.grammar_calculator(activity)
    array_count = activity.data.dig('questions')&.size
    if array_count.present? && array_count != 0
      return array_count
    end

    activity.data.dig('concepts')&.values&.map(&:values)&.flatten&.sum
  end
end
