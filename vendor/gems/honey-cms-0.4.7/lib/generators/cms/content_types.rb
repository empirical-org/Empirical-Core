require 'rails/generators/active_record'
require 'generators/cms/base'

module CMS
  module Generators

    class ContentTypes < Base
      include Rails::Generators::Migration

      class_option :except, type: :array, default: [],
                            desc: 'skip certain types.'

      class_option :only, type: :string, default: false,
                          desc: 'run a specific type generator.'

      def self.next_migration_number(dirname)
        ActiveRecord::Generators::Base.next_migration_number(dirname)
      end
    end

  end
end
