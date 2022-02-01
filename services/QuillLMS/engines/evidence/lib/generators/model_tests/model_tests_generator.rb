require 'rails/generators/test_unit'

class ModelTestsGenerator < TestUnit::Generators::Base # :nodoc:
  source_root File.expand_path('../templates', __FILE__)

  RESERVED_YAML_KEYWORDS = %w(y yes n no true false on off null)

  argument :attributes, type: :array, default: [], banner: "field:type field:type"
  class_option :fixture, type: :boolean

  check_class_collision suffix: "Test"

  def create_test_file
    template 'model_tests.rb', File.join('test/models', class_path, "#{file_name}_test.rb")
  end

  hook_for :fixture_replacement

  private
  def yaml_key_value(key, value)
    if RESERVED_YAML_KEYWORDS.include?(key.downcase)
      "'#{key}': #{value}"
    else
      "#{key}: #{value}"
    end
  end
end
