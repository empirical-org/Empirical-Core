SecureHeaders::Configuration.default do |config|
  default_config = {
    default_src: [
      "'self'", 
      "https://*.quill.org",
      "https://quill.org",
      "'unsafe-inline'"                                           # TODO: remove once nonce strategy is in place
    ],                                                            # fallback for more specific directives

    object_src: %w('none'),                                       # addresses <embed>, <object>, and <applet>

    script_src: [
      "'self'",
      "https://*.quill.org", 
      "https://quill.org", 
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
      "https://*.sentry.io",
      "https://*.heapanalytics.com"
    ],                                                            

    font_src: [
      "'self'",
      "https://intercomcdn.com",
      "https://*.intercomcdn.com",
      "https://quill.org",
      "https://*.quill.org",
      "https://*.typekit.net",
      "https://*.fontawesome.com",
      "https://*.gstatic.com"

    ], 

    img_src: [
      "https://heapanalytics.com",
      "https://*.heapanalytics.com",
      "https://intercomassets.com",
      "https://*.intercomassets.com",
      "https://*.quill.org",
      "https://quill.org",
      "https://*.typekit.net",
      "https://*.google.com",
      "https://*.inspectlet.com",
      "https://*.amazonaws.com"
    ],

    base_uri: %w('self'),                                         # used for relative URLs

    style_src: [
      "'self'",
      "https://*.quill.org",
      "https://quill.org",  
      "'unsafe-inline'",
      "https://*.fontawesome.com",
      "https://*.googleapis.com",
      "https://*.gstatic.com"      
    ],

    connect_src: [                                                # for XHR, etc
      "'self'",  
      "https://*.quill.org",
      "https://quill.org",
      "https://*.amplitude.com",
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
      "wss://*.inspectlet.com",
      "https://*.intercom.io",
      "wss://*.intercom.io",
      "https://*.coview.com",
      "https://*.sentry.io"
    ]
  }

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
