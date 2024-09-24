# frozen_string_literal: true

RSpec.configure do |config|
  SELENIUM_WINDOW_SIZE = [1920, 1280]

  config.around(type: :system) do |example|
    WebMock.allow_net_connect!
    VCR.turned_off { example.run }
    WebMock.disable_net_connect!
  end

  config.before(type: :system) { driven_by :rack_test }

  config.after(type: :system) { warn(page.driver.browser.manage.logs.get(:browser)) }
end
