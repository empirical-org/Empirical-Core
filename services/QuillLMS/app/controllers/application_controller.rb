# frozen_string_literal: true

class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  include QuillAuthentication

  CLEVER_REDIRECT = :clever_redirect
  GOOGLE_REDIRECT = :google_redirect
  POST_AUTH_REDIRECT = :post_auth_redirect
  GOOGLE_OR_CLEVER_JUST_SET = :google_or_clever_just_set
  KEEP_ME_SIGNED_IN = :keep_me_signed_in
  EVIDENCE = 'evidence'
  PROOFREADER = 'proofreader'
  GRAMMAR = 'grammar'
  CONNECT = 'connect'
  DIAGNOSTIC = 'diagnostic'
  LESSONS = 'lessons'

  #helper CMS::Helper
  helper SegmentioHelper

  include NewRelicAttributable
  before_action :set_raven_context
  before_action :confirm_valid_session
  before_action :set_default_cache_security_headers

  def admin!
    return if current_user.try(:admin?)

    auth_failed
  end

  def staff!
    return if current_user.try(:staff?)

    auth_failed
  end

  def teacher_or_staff!
    return if current_user.try(:teacher?)

    staff!
  end

  def teacher!
    return if current_user.try(:teacher?)

    admin!
  end

  def student!
    return if current_user.try(:student?)

    auth_failed
  end

  def show_errors
    status = env['PATH_INFO'][1..-1]
    render_error(status)
  end

  def routing_error(error = 'Routing error', status = :not_found, exception=nil)
    render_error(404)
  end

  def render_error(status)
    respond_to do |format|
      format.html { render template: "errors/error#{status}", status: status }
      # So technically we shouldn't really be setting the content-type header
      # in a content-less error response at all, but CORS security logic in Rails
      # falsely flags lack of content-type headers in responses to routes that end
      # in '.js' as a class of responses that need CORS protection and 500s when
      # attempting to serve a 404.  So, we set the content_type to 'text/html'.
      format.js { render head: :not_found, body: nil, status: status, content_type: 'text/html' }
      format.any { render head: :not_found, body: nil, status: status }
    end
  end

  def login_failure_message
    login_failure 'Incorrect username/email or password'
  end


  def login_failure(error)
    @user = User.new
    flash[:error] = error
    redirect_to '/session/new'
  end

  def default_params
    [:utf8, :authenticity_token, :commit]
  end

  def route_redirects_to_my_account?(route)
    route&.include?(Teachers::ClassroomManagerController::MY_ACCOUNT)
  end

  def route_redirects_to_classrooms_index?(route)
    route&.include?(Teachers::ClassroomsController::INDEX)
  end

  def route_redirects_to_assign?(route)
    route&.include?(Teachers::ClassroomManagerController::ASSIGN)
  end

  def route_redirects_to_diagnostic?(route)
    route&.include?(ActivitiesController::DIAGNOSTIC)
  end

  def non_standard_route_redirect?(route)
    (
      route_redirects_to_my_account?(route) ||
      route_redirects_to_assign?(route) ||
      route_redirects_to_classrooms_index?(route) ||
      route_redirects_to_diagnostic?(route)
    )
  end

  protected def set_vary_header
    response.headers['Vary'] = 'Accept'
  end

  protected def set_default_cache_security_headers
    response.headers['Cache-Control'] = 'no-cache, no-store'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = 'Fri, 01 Jan 1990 00:00:00 GMT'
  end

  protected def set_raven_context
    Raven.user_context(id: session[:current_user_id])
    Raven.extra_context(params: params.to_unsafe_h, url: request.url)
  end

  # rubocop:disable Metrics/CyclomaticComplexity
  protected def confirm_valid_session
    # Don't do anything if there's no authorized user or session
    return if !current_user || !session

    # if user is staff, logout if last_sign_in was more than 4 hours ago
    if current_user && current_user.role == 'staff' && current_user.last_sign_in
      hours = time_diff(current_user.last_sign_in) / 3600
      if hours > 4
        user_id = current_user.id
        auth_credential = AuthCredential.where(user_id: user_id).first
        if auth_credential.present?
          auth_credential.destroy!
        end
        return if !current_user || !session
      end
    end

    return reset_session if user_inactive_for_too_long?

    # If the user is google authed, but doesn't have a valid refresh
    # token, then we need to invalidate their session
    return reset_session if current_user.google_id && current_user.auth_credential && !current_user.auth_credential&.refresh_token

    # Assuming that the refresh_token expires at (current_user.auth_credential.created_at  + 6 months),
    # we can reset the session whenever (Time.current > (current_user.auth_credential.created_at + 5 months))
    return reset_session if current_user.google_id && current_user.auth_credential && Time.current > (current_user.auth_credential.created_at + 5.months)
  end
  # rubocop:enable Metrics/CyclomaticComplexity

  protected def user_inactive_for_too_long?
    return false if session[KEEP_ME_SIGNED_IN] || current_user.google_id || current_user.clever_id

    seconds_in_day = 86400
    max_inactivity = 30

    days_since_last_sign_in = current_user.last_sign_in ? time_diff(current_user.last_sign_in)/seconds_in_day : 0
    days_since_last_active = current_user.last_active ? time_diff(current_user.last_active)/seconds_in_day : max_inactivity

    [days_since_last_active, days_since_last_sign_in].min >= max_inactivity
  end

  protected def time_diff(timestamp)
    now = Time.current.utc

    diff = now - timestamp
    diff.round.abs
  end

end
