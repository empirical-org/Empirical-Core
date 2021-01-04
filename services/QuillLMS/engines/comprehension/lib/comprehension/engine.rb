# require_relative '../quill_scaffold_controller'
module Comprehension
  class Engine < ::Rails::Engine
    config.eager_load_paths << "#{config.root}/lib/comprehension"
    isolate_namespace Comprehension

    config.generators do |g|

      g.orm :active_record
      g.test_framework :shoulda, fixtures: false
      g.fixtures false

      g.stylesheets false
      g.helper false
      g.javascript false
      g.assets false
      g.template_engine nil

      g.fallbacks[:shoulda] = :test_unit
    end
  end
end
