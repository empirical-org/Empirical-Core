# frozen_string_literal: true

Rails.application.config.assets.version = "1.1"

Rails.application.config.assets.precompile += [
  'sign_up_email.css',
  'admin_usage_snapshot_report_pdf.scss',
  'stats_email.scss',
  'rollup_email.scss'
]
