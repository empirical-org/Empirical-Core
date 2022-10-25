# frozen_string_literal: true

class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  include ForceDbWriterRole
  include NewRelicAttributable
  include QuillAuthentication
  include DemoAccountBannerLinkGenerator
  include SchoolSelectionReminderMilestone

  rescue_from ActionController::InvalidAuthenticityToken,
    with: :handle_invalid_authenticity_token

  # session keys
  CLEVER_REDIRECT = :clever_redirect
  EXPIRED_SESSION_REDIRECT = :expired_session_redirect
  GOOGLE_OFFLINE_ACCESS_EXPIRED = :google_offline_access_expired
  GOOGLE_REDIRECT = :google_redirect
  GOOGLE_OR_CLEVER_JUST_SET = :google_or_clever_just_set
  KEEP_ME_SIGNED_IN = :keep_me_signed_in
  POST_AUTH_REDIRECT = :post_auth_redirect

  EVIDENCE = 'evidence'
  PROOFREADER = 'proofreader'
  GRAMMAR = 'grammar'
  CONNECT = 'connect'
  DIAGNOSTIC = 'diagnostic'
  LESSONS = 'lessons'

  helper SegmentioHelper

  before_action :set_raven_context
  before_action :check_staff_for_extended_session
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

  private def handle_invalid_authenticity_token
    flash[:error] = t('actioncontroller.errors.invalid_authenticity_token')

    respond_to do |format|
      format.html { redirect_back(fallback_location: root_path) }
      format.json { render json: { redirect: URI.parse(request.referer).path }, status: 303 }
    end
  end

  protected def check_staff_for_extended_session
    return unless current_user&.staff_session_duration_exceeded?

    reset_session_and_redirect_to_sign_in
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

  protected def confirm_valid_session
    return if current_user.nil? || session.nil? || session[:staff_id] || admin_impersonating_user?(current_user)
    return unless reset_session? || current_user.google_access_expired?

    reset_session_and_redirect_to_sign_in
  end

  protected def reset_session_and_redirect_to_sign_in
    reset_session
    session[EXPIRED_SESSION_REDIRECT] = true

    respond_to do |format|
      format.html { redirect_to new_session_path }
      format.json { render json: { redirect: new_session_path }, status: 303 }
      format.pdf { redirect_to new_session_path }
    end
  end

  protected def reset_session?
    return false if session[KEEP_ME_SIGNED_IN] || current_user.google_id || current_user.clever_id

    current_user.inactive_too_long?
  end
end
