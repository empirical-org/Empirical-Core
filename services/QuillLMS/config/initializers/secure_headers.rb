csp_types = %w(default_src script_src font_src img_src style_src connect_src)
permissive_config = csp_types.each_with_object({}) do |n, memo|
  memo[n.to_sym] = [
    "*" # wildcard directive must not be quoted
  ]
  memo
end
permissive_config[:script_src] = permissive_config[:script_src].concat(
  [
    "'unsafe-inline'",
    "'unsafe-eval'"    
  ]
)
permissive_config[:style_src] = permissive_config[:style_src].concat(
  [
    "'unsafe-inline'"
  ]
)

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
      "https://*.sentry.io"
    ],                                                            

    font_src: [
      "'self'",
      "https://*.typekit.net",
      "https://*.fontawesome.com",
      "https://*.gstatic.com"

    ], 

    img_src: [
      "https://*.quill.org",
      "https://quill.org",
      "https://*.typekit.net",
      "https://*.google.com",
      "https://*.inspectlet.com"
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
      "https://*.coview.com",
      "https://*.sentry.io"
    ]
  }

  
  config.csp_report_only = default_config
  config.csp             = permissive_config # the order of these two declarations matters.

  config.x_frame_options = SecureHeaders::OPT_OUT
  
  config.cookies = {
    secure: true, 
    httponly: true, 
    samesite: {
      lax: true 
    }
  }
end
