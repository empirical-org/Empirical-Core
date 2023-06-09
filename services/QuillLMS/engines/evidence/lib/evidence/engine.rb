# frozen_string_literal: true

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

    if defined?(FactoryBot)
      initializer "evidence.factories", after: "factory_bot.set_factory_paths" do
        FactoryBot.definition_file_paths << File.expand_path('../../../spec/factories/evidence', __FILE__)
      end
    end
  end
end
