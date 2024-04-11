# frozen_string_literal: true

Rails.application.config.assets.version = "1.1"

Rails.application.config.assets.precompile += [
  'stats_email.scss',
  'rollup_email.scss'
]
