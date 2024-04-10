# frozen_string_literal: true

Rails.application.config.assets.version = "1.1"

Rails.application.config.assets.precompile += [
  'jquery-1.8.2',
  'sign_up_email.css',
  'admin_usage_snapshot_report_pdf.scss',
  'stats_email.scss',
  'rollup_email.scss'
]
