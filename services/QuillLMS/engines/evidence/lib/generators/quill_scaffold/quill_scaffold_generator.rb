require 'rails/generators'
require 'rails/generators/rails/resource/resource_generator'

module Generators
  module QuillScaffold
    class QuillScaffoldGenerator < Rails::Generators::ResourceGenerator
      remove_hook_for :resource_controller
      remove_class_option :actions

      class_option :resource_route, type: :boolean

      hook_for :scaffold_controller, required: true
    end
  end
end
