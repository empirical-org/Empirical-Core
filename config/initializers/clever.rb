module Clever
  CLIENT_ID = ENV['CLEVER_CLIENT_ID'] || '279109faf81350c2f429'
  CLIENT_SECRET = ENV['CLEVER_CLIENT_SECRET'] || '5f6b971a3d678dd35499f7e4f46d44ca56c0adb3'
  REDIRECT_URL = ENV['CLEVER_REDIRECT_URL'] || 'http://localhost:3000/auth/clever/callback'
end

Clever.configure do |config|
  config.api_key = '4BC0B667F8DC7BFCEB8096EBBBAD1B8A'
end
