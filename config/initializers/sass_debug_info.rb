# https://github.com/rails/sass-rails/issues/157
if Rails.env.development?
  require 'sass'
  require 'sass/engine'

  module Sass
    class Engine
      def initialize(template, options={})
        @options = self.class.normalize_options(options)
        @options[:debug_info] = true
        @template = template
      end
    end
  end
end
