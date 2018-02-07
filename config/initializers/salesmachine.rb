require 'salesmachine'
require 'cgi'

$smclient = Salesmachine::Api.new :api_key => ENV["SALESMACHINE_API_KEY"]
