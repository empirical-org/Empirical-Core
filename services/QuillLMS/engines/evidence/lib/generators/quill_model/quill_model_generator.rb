require 'rails/generators/rails/resource/resource_generator'
require 'rails/generators/resource_helpers'
require 'rails/generators/named_base'

class QuillModelGenerator < Rails::Generators::NamedBase
  source_root File.expand_path('../templates', __FILE__)
  include Rails::Generators::ResourceHelpers
  include Rails::Generators::ModelHelpers

  def create_model_file
    template "model.rb", File.join("app/models", class_path, "#{file_name}.rb")
  end

  def create_module_file
    return if regular_class_path.empty?
    template "module.rb", File.join("app/models", "#{class_path.join('/')}.rb") if behavior == :invoke
  end
end
