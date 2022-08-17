# frozen_string_literal: true

require 'billy/capybara/rspec'

# https://thecodest.co/blog/testing-your-javascript-with-ruby
RSpec.configure do |config|
  Capybara.register_driver :local_selenium_chrome_headless do |app|
    options = Selenium::WebDriver::Chrome::Options.new(
      args: [
        'headless',
        'window-size=1920x1280'
      ]
    )

    Capybara::Selenium::Driver.new(app, browser: :chrome, options: options)
  end

  Capybara.register_driver :remote_selenium_chrome do |app|
    capabilities = Selenium::WebDriver::Remote::Capabilities.chrome(loggingPrefs: { browser: 'ALL'} )

    Capybara::Selenium::Driver.new(
      app,
      browser: :remote,
      url: ENV.fetch('SELENIUM_DRIVER_URL'),
      desired_capabilities: capabilities
    )
  end

  Capybara.configure do |capybara_config|
    capybara_config.app_host = 'http://localhost'
    capybara_config.server_port = 3000
    capybara_config.default_driver = :selenium
    capybara_config.default_max_wait_time = 10
  end

  config.around(type: :system) do |example|
    WebMock.allow_net_connect!
    VCR.turned_off { example.run }
    WebMock.disable_net_connect!
  end

  config.before(type: :system) { driven_by :rack_test }

  config.before(type: :system, js: true) do
    if ENV["SELENIUM_DRIVER_URL"].present?
      driven_by :remote_selenium_chrome
    else
      # driven_by :local_selenium_chrome_headless
      driven_by :selenium_chrome_billy
    end
  end

  config.after(type: :system) { warn(page.driver.browser.manage.logs.get(:browser)) }

  Billy.configure do |c|
    c.cache = false
    c.cache_request_headers = false
    c.persist_cache = false
    c.record_stub_requests = true
  end
end
