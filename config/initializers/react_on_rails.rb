# Shown below are the defaults for configuration
ReactOnRails.configure do |config|
  config.generated_assets_dir = File.join(%w[public webpack])
  # config.webpack_generated_files = [
  #   'vendor.js',
  #   'app.js',
  #   'home.js',
  #   'student.js',
  #   'session.js',
  #   'login.js',
  #   'firewall_test.js',
  #   'public.js',
  #   'tools.js',
  #   'vendor.css',
  #   'app.css',
  #   'home.css',
  #   'student.css',
  #   'session.css',
  #   'login.css',
  #   'firewall_test.css',
  #   'public.css',
  #   'tools.css'
  # ]
  config.build_test_command = "npm run build:test"
  config.server_bundle_js_file = ""
  config.server_renderer_pool_size = 1
  config.server_renderer_timeout = 20
  config.development_mode = Rails.env.development?
  config.replay_console = true
  config.logging_on_server = true
  config.prerender = false
  config.trace = Rails.env.development?
  config.skip_display_none = false
end
