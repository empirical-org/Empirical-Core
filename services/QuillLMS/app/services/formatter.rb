# frozen_string_literal: true

class Formatter < ApplicationService
  class UnknownFormat < StandardError; end

  attr_reader :format, :value

  FORMATTERS = [
    DEFAULT = :default,
    ALL_CAPS = :all_caps,
    AS_LIST = :as_list,
    AS_MINUTES_STRING = :as_minutes_string,
    AS_RATIO = :as_ratio,
    AS_ROUNDED_INTEGER = :as_rounded_integer,
    BLANK_AS_ZERO = :blank_as_zero,
    PERCENT_AS_INTEGER = :percent_as_integer
  ]

  LAMBDAS = {
    DEFAULT => ->(x) { x },
    ALL_CAPS => ->(x) { x.upcase },
    AS_LIST => ->(x) { x.join(', ') },
    AS_MINUTES_STRING => ->(x) { x.present? ? "#{x.round / 60}:#{(x.round % 60).to_s.rjust(2, '0')}" : LAMBDAS[BLANK_AS_ZERO].call(x) },
    AS_RATIO => ->(x) { x.map{ |value| LAMBDAS[BLANK_AS_ZERO].call(value) }.join(' of ') },
    AS_ROUNDED_INTEGER => ->(x) { x.present? ? x.round : LAMBDAS[BLANK_AS_ZERO].call(x) },
    BLANK_AS_ZERO => ->(x) { x.presence || 0 },
    PERCENT_AS_INTEGER => ->(x) { x.present? ? LAMBDAS[AS_ROUNDED_INTEGER].call(x * 100) : LAMBDAS[BLANK_AS_ZERO].call(x) }
  }

  def initialize(format, value)
    @format = format
    @value = value
  end

  def run
    validate_format(format)

    lambdas[format].call(value)
  end

  def validate_format(format)
    raise UnknownFormat, "Unrecognized formatter: '#{format}'" unless formatters.include?(format)
  end

  def formatters = FORMATTERS
  def lambdas = LAMBDAS
end
