# frozen_string_literal: true

class PdfFileBuilder < ApplicationService
  ENCODING = 'ascii-8bit'
  LAYOUT = 'pdf'
  LANDSCAPE = 'Landscape'
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
    ApplicationController.renderer.render(
      locals: { data: data },
      layout: LAYOUT,
      template: template
    )
  end

  private def pdf
    WickedPdf.new.pdf_from_string(html)
    # WickedPdf.new.pdf_from_string(html, orientation: LANDSCAPE)
  end

  private def tempfile
    @tempfile ||= Tempfile.new(TEMPFILE_NAME, encoding: ENCODING)
  end
end
