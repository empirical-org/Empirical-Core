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
    ApplicationController.renderer.render(locals: { data: data }, template: template, layout: 'pdf')
  end

  private def pdf
    WickedPdf.new.pdf_from_string(html)
  end

  private def tempfile
    @tempfile ||= Tempfile.new(TEMPFILE_NAME, encoding: 'ascii-8bit')
  end
end
