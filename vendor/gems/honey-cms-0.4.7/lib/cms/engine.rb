# encoding: UTF-8

require 'cms/inflections'
require 'redcarpet'

module CMS
  class Engine < ::Rails::Engine
    initializer 'cms.markdown' do |app|
      ::Markdown = Redcarpet::Markdown.new(Redcarpet::Render::HTML.new(hard_wrap: true),
        autolink: true,
        space_after_headers: true,
        superscript: true,
        tables: true)
    end
  end
end
