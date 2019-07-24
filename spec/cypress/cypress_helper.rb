# This is loaded once before the first command is executed

require 'database_cleaner'
require 'factory_bot_rails'
require 'cypress_dev/smart_factory_wrapper'

CypressDev::SmartFactoryWrapper.configure(
  always_reload: true,
  factory: FactoryBot,
  files: Dir['./spec/factories/**/*.rb']
)
