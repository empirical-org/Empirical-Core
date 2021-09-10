SecureHeaders::Configuration.default do |config|
  config.csp = SecureHeaders::OPT_OUT
  config.x_frame_options = SecureHeaders::OPT_OUT
  config.cookies = {
    secure: true, 
    httponly: true, 
    samesite: {
      lax: true 
    }
  }
end
