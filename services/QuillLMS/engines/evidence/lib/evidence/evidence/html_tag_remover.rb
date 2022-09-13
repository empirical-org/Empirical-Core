# frozen_string_literal: true

module Evidence
  class HTMLTagRemover < ApplicationService
    HTML_TAG_REGEX = /<("[^"]*"|'[^']*'|[^'">])*>/
    SPACE = " "

    attr_reader :html

    def initialize(html)
      @html = html
    end

    def run
      html
        .gsub(HTML_TAG_REGEX, SPACE) # remove html tags
        .gsub("&#x27;", "'") # replace html single quotes
        .gsub(/(‘|’)/,"'") # replace html single curly quotes
        .gsub("&quot;","\"") # replace html double quotes
        .gsub(/(“|”)/,"\"") # replace html double curly quotes
        .gsub(/\s+/, SPACE) # replace multiple spaces with single space
        .strip
    end
  end
end
