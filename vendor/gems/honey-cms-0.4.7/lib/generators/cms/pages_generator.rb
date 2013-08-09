require 'generators/cms/base'

module CMS
  module Generators

    class PagesController < Base
      def create_pages
        CMS::Configuration.pages.each do |page|
          template
        end
      end
    end

  end
end
