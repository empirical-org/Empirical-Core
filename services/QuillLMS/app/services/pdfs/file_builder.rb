# frozen_string_literal: true

module Pdfs
  class FileBuilder < ApplicationService
    BASE_URL = "#{ENV['DEFAULT_URL']}/"
    HTTPS = 'https'
    LAYOUT = 'pdf'
    ENCODING = 'ascii-8bit'
    TEMPFILE_NAME = 'temp.pdf'

    attr_reader :data, :template, :block

    def initialize(data:, template:, &block)
      @data = data
      @template = template
      @block = block

      # Block is required since tempfile is immediately cleaned up at end of run
      raise ArgumentError, 'Block is required' unless block_given?
    end

    def run
      tempfile.write(pdf)
      tempfile.rewind
      block.call(tempfile)
    ensure
      tempfile.close
      tempfile.unlink
    end

    private def html_with_absolute_urls
      ::Grover::HTMLPreprocessor.process(
        html_with_relative_urls,
        BASE_URL,
        HTTPS
      )
    end

    private def html_with_relative_urls
      ::ApplicationController
        .new
        .render_to_string(
          layout: LAYOUT,
          locals: { data: data },
          template: template
        )
    end

    private def pdf
      ::Grover
        .new(html_with_absolute_urls)
        .to_pdf
    end

    private def tempfile
      @tempfile ||= ::Tempfile.new(TEMPFILE_NAME, encoding: ENCODING)
    end
  end
end
