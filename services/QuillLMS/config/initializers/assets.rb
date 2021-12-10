# frozen_string_literal: true

Rails.application.config.assets.version = "1.1"
Rails.application.config.assets.paths << Rails.root.join('public', 'webpack')

Rails.application.config.assets.precompile += [
  'cookie_warning.js',
  'jquery-1.8.2',
  'sign_up_email.css',
  'stats_email.css'
]
