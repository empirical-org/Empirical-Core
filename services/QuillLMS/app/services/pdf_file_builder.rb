# frozen_string_literal: true

class PdfFileBuilder < ApplicationService
  ENCODING = 'ascii-8bit'
  TEMPFILE_NAME = 'temp.pdf'

  attr_reader :data, :template

  def initialize(data, template)
    @template = template
    @data = data
  end

  def run
    tempfile.write(pdf)
    tempfile.rewind
    tempfile
  end

  private def html
    body_html = ApplicationController
      .new
      .render_to_string(locals: { data: data }, template: template, layout: 'pdf')
      
    Grover::HTMLPreprocessor.process(body_html, "#{ENV['DEFAULT_URL']}/", 'https')
  end

  private def pdf
    Grover
      .new(html)
      .to_pdf
  end

  private def tempfile
    @tempfile ||= Tempfile.new(TEMPFILE_NAME, encoding: 'ascii-8bit')
  end
end
