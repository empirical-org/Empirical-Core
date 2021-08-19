SecureHeaders::Configuration.default do |config|
  config.csp = SecureHeaders::OPT_OUT
  config.cookies = {
    secure: true, 
    httponly: true, 
    samesite: {
      lax: true 
    }
  }
end
