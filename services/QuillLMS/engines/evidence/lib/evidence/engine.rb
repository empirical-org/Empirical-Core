# frozen_string_literal: true

begin
  require 'factory_bot_rails'
rescue LoadError
  # factory_bot_rails is only available when development_dependencies
  # from the gemspec are loaded (development and test environments).
end

module Evidence
  class Engine < ::Rails::Engine
    config.eager_load_paths << "#{config.root}/lib"

    initializer "evidence.add_autoload_paths", before: :set_autoload_paths do |app|
      app.config.autoload_paths += Dir["#{app.root}/app/lib/**/"]
    end

    isolate_namespace Evidence

    config.generators do |g|
      g.orm :active_record
      g.test_framework :rspec, fixtures: false
      g.fixtures false

      g.stylesheets false
      g.helper false
      g.javascript false
      g.assets false
      g.template_engine nil
    end

    if defined?(FactoryBot)
      initializer "evidence.factories", after: "factory_bot.set_factory_paths" do
        FactoryBot.definition_file_paths << File.expand_path('../../../spec/factories/evidence', __FILE__)
      end
    end
  end
end
