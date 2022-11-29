# frozen_string_literal: true

SecureHeaders::Configuration.default do |config|
  default_config = {
    default_src: [
      "'self'",
      "https://*.quill.org",
      "https://quill.org",
      "'unsafe-inline'"                                           # TODO: remove once nonce strategy is in place
    ],                                                            # fallback for more specific directives

    frame_src: [
      "'self'",
      "https://coview.com",
      "https://*.coview.com",
      "https://intercom-sheets.com",
      "https://stripe.com",
      "https://*.stripe.com",
      "https://youtube.com",
      "https://*.youtube.com",
      "https://*.amazonaws.com",
      "https://loom.com"
    ],

    object_src: %w('none'),                                       # addresses <embed>, <object>, and <applet>

    media_src: [
      "*",
      "data:",
      "blob:"
    ],

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
      "https://stripe.com",
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
      "https://coview.com",
      "https://*.coview.com",
      "https://intercomcdn.com",
      "https://*.intercomcdn.com",
      "https://quill.org",
      "https://*.quill.org",
      "https://*.typekit.net",
      "https://*.fontawesome.com",
      "https://*.gstatic.com"

    ],

    img_src: [
      "*",
      "data:",
      "blob:"
    ],

    base_uri: %w('self'),                                         # used for relative URLs

    style_src: [
      "'self'",
      "https://*.quill.org",
      "https://quill.org",
      "'unsafe-inline'",
      "https://coview.com",
      "https://*.coview.com",
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
      "wss://coview.com",
      "wss://*.coview.com",
      "wss://*.pusherapp.com",
      "wss://*.inspectlet.com",
      "https://*.intercom.io",
      "wss://*.intercom.io",
      "https://*.coview.com",
      "https://*.sentry.io",
      "wss://*.quill.org",
      "https://*.satismeter.com",
      "http://localhost:8080/",
      "http://localhost:3200",
      "http://localhost:3100",
      "ws://localhost:3200",
      "https://checkout.stripe.com",
      "https://capture-api.ap3prod.com"
    ]
  }

  config.csp = default_config

  config.x_frame_options = SecureHeaders::OPT_OUT

  config.cookies = {
    secure: true,
    httponly: true,
    samesite: {
      lax: true
    }
  }
end
