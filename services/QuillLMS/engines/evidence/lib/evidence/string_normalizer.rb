# frozen_string_literal: true

module Evidence
  class StringNormalizer < ApplicationService
    EMDASH = "—" # You may not be able to tell, but this is an emdash
    ENDASH = "–" # You may not be able to tell, but this is an endash
    HTML_TAG_REGEX = /<("[^"]*"|'[^']*'|[^'">])*>/
    SPACE = " "

    attr_reader :input

    def initialize(input)
      @input = input
    end

    def run
      # The first three replacements are duplicates of the normalization
      # we do in the Connect front-end: https://github.com/empirical-org/quill-string-normalizer/blob/master/src/main.ts
      input.gsub(/[\u2018\u2019\u0301\u02BB\u02C8\u00B4\u0060]/, "'")
        .gsub(/[\u201C\u201D\u02DD\u0308]/, '"')
        .gsub(/[\u02CC\u201A\uFF0C]/, ',')
        .gsub(/\u2013/, ENDASH)
        .gsub(/\u2014/, EMDASH)
        .gsub(/\u2026/, "...")
    end
  end
end
