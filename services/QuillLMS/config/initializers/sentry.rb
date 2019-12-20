Raven.configure do |config|
  config.environments = %W(staging production)
  config.excluded_exceptions += ['SalesmachineRetryError']
end
