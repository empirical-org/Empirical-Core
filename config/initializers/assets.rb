Rails.application.config.assets.version = "1.0"
Rails.application.config.assets.paths << Rails.root.join('public', 'webpack')

Rails.application.config.assets.precompile += %w( cookie_warning.js )
