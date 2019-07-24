require 'salesmachine'
require 'cgi'

$smclient = unless Rails.env.test?
  Salesmachine::Api.new(api_key: ENV["SALESMACHINE_API_KEY"])
end
