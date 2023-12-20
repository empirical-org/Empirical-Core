# frozen_string_literal: true

class PdfFileBuilder < ApplicationService
  BASE_URL = "#{ENV['DEFAULT_URL']}/"
  HTTPS = 'https'
  LAYOUT = 'pdf'
  ENCODING = 'ascii-8bit'
  TEMPFILE_NAME = 'temp.pdf'

  attr_reader :data, :template

  def initialize(data:, template:)
    @data = data
    @template = template
  end

  def run
    tempfile.write(pdf)
    tempfile.rewind
    tempfile
  end

  private def html_with_absolute_urls
    Grover::HTMLPreprocessor.process(
      html_with_relative_urls,
      BASE_URL,
      HTTPS
    )
  end

  private def html_with_relative_urls
    ApplicationController
      .new
      .render_to_string(
        layout: LAYOUT,
        locals: { data: data },
        template: template
      )
  end

  private def pdf
    Grover
      .new(html_with_absolute_urls)
      .to_pdf
  end

  private def tempfile
    @tempfile ||= Tempfile.new(TEMPFILE_NAME, encoding: ENCODING)
  end
end
