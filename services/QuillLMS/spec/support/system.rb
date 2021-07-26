RSpec.configure do |config|
  config.before(:each, type: :system) { driven_by :rack_test }

  Capybara.register_driver :local_selenium_chrome_headless do |app|
    options = Selenium::WebDriver::Chrome::Options.new
    [
      "headless",
      "window-size=1920x1280",
      "disable-gpu" # https://developers.google.com/web/updates/2017/04/headless-chrome
    ].each { |arg| options.add_argument(arg) }

    Capybara::Selenium::Driver.new(app, browser: :chrome, options: options)
  end

  Capybara.register_driver :remote_selenium_chrome do |app|
    options = Selenium::WebDriver::Chrome::Options.new
    [
      url: ENV.fetch('SELENIUM_DRIVER_URL', ''),
      desired_capabilities: :chrome
    ].each { |arg| options.add_argument(arg) }

    Capybara::Selenium::Driver.new(app, browser: :remote, options: options)
  end

  Capybara.server_port = 60947
  Capybara.default_max_wait_time = 15

  config.before(:each, type: :system, js: true) do
    if ENV["SELENIUM_DRIVER_URL"].present?
      driven_by :remote_selenium_chrome
    else
      driven_by :local_selenium_chrome_headless
    end
  end
end