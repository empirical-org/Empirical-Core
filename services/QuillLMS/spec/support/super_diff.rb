return unless ENV.fetch('SUPER_DIFF', false)

require 'super_diff/rspec-rails'

SuperDiff.configure do |config|
  config.actual_color = :green
  config.expected_color = :red
  config.border_color = :yellow
  config.header_color = :yellow
end