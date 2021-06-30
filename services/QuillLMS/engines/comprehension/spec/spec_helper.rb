require 'simplecov'
require 'simplecov-json'
require 'webmock/rspec'
require 'factory_bot_rails'
WebMock.disable_net_connect!


if ENV['CONTINUOUS_INTEGRATION'] == true
  SimpleCov.formatters = SimpleCov::Formatter::MultiFormatter.new([
    SimpleCov::Formatter::HTMLFormatter,
    SimpleCov::Formatter::JSONFormatter,
  ])

  SimpleCov.start do
    track_files '{app,lib}/**/*.rb'
    add_filter '/spec/'
  end
end



# if RUBY_VERSION>='2.6.0'
#   if Rails.version < '5'
#     class ActionController::TestResponse < ActionDispatch::TestResponse
#       def recycle!
#         # dirty solution to avoid MonitorMixin double-initialize error:
#         @mon_mutex_owner_object_id = nil
#         @mon_mutex = nil
#         initialize
#       end
#     end
#   else
#     puts "Monkeypatch for ActionController::TestResponse no longer needed"
#   end
# end

#require File.expand_path("../../test/dummy/config/environment.rb",  __FILE__)

# ActiveRecord::Migrator.migrations_paths = [File.expand_path("../../test/dummy/db/migrate", __FILE__)]
# ActiveRecord::Migrator.migrations_paths << File.expand_path('../../db/migrate', __FILE__)


# Load support files
#Dir["#{File.dirname(__FILE__)}/support/**/*.rb"].sort.each { |f| require f }

# Load fixtures from the engine
# if ActiveSupport::TestCase.respond_to?(:fixture_path=)
#   ActiveSupport::TestCase.fixture_path = File.expand_path("../fixtures", __FILE__)
#   ActionDispatch::IntegrationTest.fixture_path = ActiveSupport::TestCase.fixture_path
#   ActiveSupport::TestCase.fixtures :all
# end


