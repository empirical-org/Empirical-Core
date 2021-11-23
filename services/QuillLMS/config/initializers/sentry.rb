# frozen_string_literal: true

Raven.configure do |config|
  config.environments = %W(staging production)
end
