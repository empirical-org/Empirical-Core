# frozen_string_literal: true

class QuestionCounter < ApplicationService
  attr_reader :activity, :tool_key

  PROOFREADER_REGEX = ::Regexp.new(/\{\+/)
  LESSONS_COUNTS = Configs[:lessons_question_counts]

  TOOL_CALCULATORS = {
    passage:    -> (a) { a.data.dig('passage')&.scan(PROOFREADER_REGEX)&.size},
    sentence:   -> (a) { a.data.dig('questions')&.size },
    connect:    -> (a) { a.data.dig('questions')&.size },
    diagnostic: -> (a) { a.data.dig('questions')&.size },
    evidence:   -> (_) { 3 },
    lessons:    -> (a) { LESSONS_COUNTS.dig(a.uid) }
  }
  TOOL_DEFAULTS = {
    passage: 10,
    sentence: 10,
    connect:  10,
    diagnostic: 25,
    evidence: 3,
    lessons:  5
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
end
