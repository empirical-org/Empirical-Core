# frozen_string_literal: true

module Evidence
  class HTMLTagRemover < ApplicationService
    HTML_TAG_REGEX = /<("[^"]*"|'[^']*'|[^'">])*>/

    attr_reader :html

    def initialize(html)
      @html = html
    end

    def run
      html
        .gsub(HTML_TAG_REGEX, " ") # remove html tags
        .gsub("&#x27;", "'") # replace html single quotes
        .gsub(/(\‘|\’)/,"'") # replace html single quotes
        .gsub("&quot;","\"") # replace html double quotes
        .gsub(/(\“|\”)/,"\"") # replace html double quotes
        .gsub(/\s+/," ") # replace multiple spaces with single space
        .strip
    end
  end
end
