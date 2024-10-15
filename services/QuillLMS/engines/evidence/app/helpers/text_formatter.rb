# frozen_string_literal: true

module TextFormatter
  require 'cgi'
  require 'nokogiri'

  def strip_punctuation(str)
    str.gsub(/[[:punct:]]/, '')
  end

  def strip_tags(input)
    ::ActionController::Base.helpers.strip_tags(input)
  end

  def strip_tags_and_replace_with_spaces(input)
    Nokogiri::HTML(input).xpath('//text()').map(&:text).join(' ')
  end

  def strip_punctuation_and_downcase(str)
    strip_punctuation(str).downcase
  end

  def unescape_html(html_string)
    CGI.unescapeHTML(html_string)
  end

  def unescape_html_strip_tags_and_punctuation_and_downcase(str)
    strip_punctuation_and_downcase(strip_tags_and_replace_with_spaces(unescape_html(str))).squeeze(' ')
  end
end
