require 'generators/cms/base'

module CMS
  module Generators

    class Config < Base
      source_root File.expand_path('../templates', __FILE__)

      def create_config
        template 'cms.yml', 'config/cms.yml'
      end
    end

  end
end
