SecureHeaders::Configuration.default do |config|
  config.csp = {
    default_src: [
      "'self'", 
      "https://*.quill.org",
      "'unsafe-inline'"
    ],                                                            # fallback for more specific directives
    object_src: %w('none'),                                       # addresses <embed>, <object>, and <applet>
    script_src: [
      "'self'", 
      "'unsafe-inline'",
      "'unsafe-eval'",                                            # allows use of eval()
      "https://*.fontawesome.com",
      "http://*.typekit.net",
      "https://*.segment.com",
      "https://*.segment.io",
      "https://*.newrelic.com",
      "https://*.googleapis.com",
      "https://*.pusher.com",
      "https://*.google-analytics.com",
      "https://*.inspectlet.com",
      "https://*.satismeter.com",
      "https://*.stripe.com",
      "https://*.amplitude.com",
      "https://*.nr-data.net",
      "https://*.doubleclick.net",
      "https://*.typekit.net"                                     # typekit currently serves fonts over http, 
                                                                  # but we want to avoid an outage if and when they upgrade to https
    ],                                                            
    font_src: %w('self' https://*.typekit.net),
    img_src: %w('self' https://*.quill.org https://*.typekit.net),
    base_uri: %w('self')                                          # used for relative URLs
  }

  config.cookies = {
    secure: true, 
    httponly: true, 
    samesite: {
      lax: true 
    }
  }
end
