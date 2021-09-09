SecureHeaders::Configuration.default do |config|
  config.csp = {
    default_src: [
      "'self'", 
      "https://*.quill.org",
      "'unsafe-inline'"                                           # TODO: remove once nonce strategy is in place
    ],                                                            # fallback for more specific directives

    object_src: %w('none'),                                       # addresses <embed>, <object>, and <applet>

    script_src: [
      "https://*.quill.org",  
      "'unsafe-inline'",
      "'unsafe-eval'",                                            # allows use of eval()
      "https://*.clever.com",
      "https://*.fontawesome.com",
      "http://*.typekit.net",
      "https://*.segment.com",
      "https://*.segment.io",
      "https://*.newrelic.com",
      "https://*.nr-data.net",
      "https://*.googleapis.com",
      "https://*.gstatic.com",
      "https://*.pusher.com",
      "https://*.google-analytics.com",
      "https://*.inspectlet.com",
      "https://*.satismeter.com",
      "https://*.stripe.com",
      "https://*.amplitude.com",
      "https://*.doubleclick.net",
      "https://*.intercom.io",
      "https://*.intercomcdn.com",
      "https://*.coview.com",
      "https://*.sentry.io"
    ],                                                            

    font_src: [
      "'self'",
      "https://*.typekit.net",
      "https://*.fontawesome.com",
      "https://*.gstatic.com"

    ], 

    img_src: %w(https://*.quill.org https://*.typekit.net),

    base_uri: %w('self'),                                         # used for relative URLs

    style_src: [
      "https://*.quill.org",  
      "'unsafe-inline'",
      "https://*.fontawesome.com",
      "https://*.googleapis.com",
      "https://*.gstatic.com"      
    ],

    connect_src: [                                                # for XHR, etc
      "'self'",  
      "https://*.quill.org",
      "https://*.segment.com",
      "https://*.segment.io",
      "https://*.nr-data.net",
      "https://*.google-analytics.com",
      "https://*.google.com",
      "https://*.inspectlet.com",
      "https://*.doubleclick.net",
      "https://*.pusherapp.com",
      "https://*.pusher.com",
      "wss://*.pusherapp.com",
      "https://*.intercom.io",
      "https://*.coview.com",
      "https://*.sentry.io"
    ]
  }

  config.cookies = {
    secure: true, 
    httponly: true, 
    samesite: {
      lax: true 
    }
  }
end
