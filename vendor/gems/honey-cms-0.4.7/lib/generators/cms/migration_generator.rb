require 'generators/cms/content_types'

module CMS
  module Generators

    class MigrationGenerator < ContentTypes
      source_root File.expand_path('../templates', __FILE__)

      def create_migration_file
        @migration_types = CMS::Configuration.scoped_types(options)

        if options[:only].present?
          migration_template 'migration.rb', "db/migrate/create_#{options[:only].underscore.pluralize}"
        else
          migration_template 'migration.rb', 'db/migrate/create_cms'
        end
      end
    end

  end
end
