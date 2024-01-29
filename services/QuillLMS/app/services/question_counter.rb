# frozen_string_literal: true

class QuestionCounter < ApplicationService
  attr_reader :activity, :tool_key

  PROOFREADER_REGEX = ::Regexp.new(/\{(\+|-)/)
  LESSONS_COUNTS = Configs[:lessons_question_counts]

  TOOL_CALCULATORS = {
    passage:    ->(a) { a.data['passage']&.scan(PROOFREADER_REGEX)&.size },
    sentence:   ->(a) { grammar_calculator(a) },
    connect:    ->(a) { question_array_size(a) },
    diagnostic: ->(a) { question_array_size(a) },
    lessons:    ->(a) { LESSONS_COUNTS[a.uid] },
    evidence:   ->(_) { 3 }
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
    count = question_array_size(activity)

    return count if count.present? && count > 0

    concepts_sum(activity)
  end

  def self.question_array_size(activity)
    activity.data['questions']&.size
  end

  def self.concepts_sum(activity)
    activity.data['concepts']&.values&.map(&:values)&.flatten&.sum
  end
end
