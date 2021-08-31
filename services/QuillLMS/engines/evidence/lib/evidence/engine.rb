# require_relative '../quill_scaffold_controller'
module Evidence
  class Engine < ::Rails::Engine
    config.eager_load_paths += %W{#{config.root}/lib/evidence}
    isolate_namespace Evidence

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
