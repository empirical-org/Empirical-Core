require 'generators/cms/content_types'

module CMS
  module Generators

    class AdminAreaGenerator < ContentTypes
      source_root File.expand_path('../templates', __FILE__)
      class_option :controller, type: :boolean, default: false,
                                desc: 'generate the controller'

      def copy_controller_file
        template 'cms_base_controller.rb', 'app/controllers/cms/base_controller.rb' if options[:controller]

        empty_directory 'app/controllers/cms'
        empty_directory 'app/models/cms'

        CMS::Configuration.scoped_types(options).each do |type|
          @name = (@type = type).model_name
          template 'type_controller.rb', "app/controllers/cms/#{@name.collection}_controller.rb"

          if @type.options[:model]
            template 'type_model.rb', "app/models/cms/#{@name.element}.rb"
          end

          %w(index new show edit _fields).each do |view|
            template "views/#{view}.html.haml", "app/views/cms/#{@name.collection}/#{view}.html.haml"
          end
        end
      end
    end

  end
end
