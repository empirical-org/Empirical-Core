class AffiliateMiddleware
  QUERY_PARAMETER = 'champion'
  COOKIE_NAME = 'referral_code'
  EXPIRES_AFTER = 60 * 60 * 24 * 365 # 1 year

  def initialize(app)
    @app = app
  end

  def call(env)
    request = Rack::Request.new(env)

    referral_code_in_cookie = request.cookies[COOKIE_NAME]
    referral_code_in_request = request.params[QUERY_PARAMETER]

    if referral_code_in_request
      env[ReferrerUser::ENV_VARIABLE_NAME] = referral_code_in_request
    elsif referral_code_in_cookie
      env[ReferrerUser::ENV_VARIABLE_NAME] = referral_code_in_cookie
    end

    status, headers, body = @app.call(env)

    if referral_code_in_request
      Rack::Utils.set_cookie_header!(headers, COOKIE_NAME, {
        domain: '*.quill.org',
        path: '/',
        value: request.params[QUERY_PARAMETER],
        expires: Time.now + EXPIRES_AFTER
      })
    end

    [status, headers, body]
  end
end
