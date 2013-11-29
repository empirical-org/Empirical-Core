# encoding: UTF-8

require 'cms/inflections'
# require 'redcarpet'

module CMS
  class Engine < ::Rails::Engine
    initializer 'cms.markdown' do |app|
      ::Markdown = if defined?(Redcarpet)
        Redcarpet::Markdown.new(Redcarpet::Render::HTML.new(hard_wrap: true),
          autolink: true,
          space_after_headers: true,
          superscript: true,
          tables: true)
      else
        out = Module.new
        def out.render text
          Kramdown::Document.new(text).to_html
        end
        out
      end
    end
  end
end
