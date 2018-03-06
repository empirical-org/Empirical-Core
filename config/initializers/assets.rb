Rails.application.config.assets.version = "1.0"
Rails.application.config.assets.paths << Rails.root.join('public', 'webpack')

Rails.application.config.assets.precompile += [
  'cookie_warning.js',
  'jquery-1.8.2',
]
