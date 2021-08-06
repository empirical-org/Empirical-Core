SecureHeaders::Configuration.default do |config|
  #config.csp = SecureHeaders::OPT_OUT
  config.csp = {
    #disable_nonce_backwards_compatibility: true,
    default_src: %w('none'),
    object_src: %w('none'),
    script_src: %w('unsafe-inline' 'unsafe-eval' 'strict-dynamic'),
    base_uri: %w('self')
  }
  config.cookies = {
    secure: true, 
    httponly: true, 
    samesite: {
      lax: true 
    }
  }

  config.csp_report_only = config.csp.merge({
    img_src: %w(somewhereelse.com),
    report_uri: %w(https://hooks.slack.com/services/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)
  })
end



# Content-Security-Policy:
#   object-src 'none';
#   script-src 'nonce-{random}' 'unsafe-inline' 'unsafe-eval' 'strict-dynamic' https: http:;
#   base-uri 'none';
#   report-uri https://your-report-collector.example.com/