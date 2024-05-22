# frozen_string_literal: true

Sentry.init do |config|
  config.enabled_environments = %W(staging production)
  config.breadcrumbs_logger = [:active_support_logger, :http_logger]

  config.dsn = ENV['SENTRY_DSN'] if ENV['SENTRY_DSN'].present?
end
