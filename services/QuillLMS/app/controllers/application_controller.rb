class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  include QuillAuthentication

  CLEVER_REDIRECT = :clever_redirect
  GOOGLE_REDIRECT = :google_redirect
  POST_AUTH_REDIRECT = :post_auth_redirect
  GOOGLE_OR_CLEVER_JUST_SET = :google_or_clever_just_set
  COMPREHENSION = 'comprehension'
  PROOFREADER = 'proofreader'
  GRAMMAR = 'grammar'
  LESSONS = 'lessons'

  #helper CMS::Helper
  helper SegmentioHelper

  # FIXME: disabled till it's clear what this does
  # before_action :setup_visitor
  before_action :should_load_intercom
  before_action :set_raven_context
  before_action :confirm_valid_session
  # before_action :stick_to_leader_db

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
    status = env["PATH_INFO"][1..-1]
    render_error(status)
  end

  def routing_error(error = 'Routing error', status = :not_found, exception=nil)
    @current_user = current_user
    #if current_user == nil render_error(404) : render_error()
    render_error(404)
  end

  def render_error(status)
    respond_to do |format|
      format.html { render template: "errors/error_#{status}", status: status }
      # So technically we shouldn't really be setting the content-type header
      # in a content-less error response at all, but CORS security logic in Rails
      # falsely flags lack of content-type headers in responses to routes that end
      # in ".js" as a class of responses that need CORS protection and 500s when
      # attempting to serve a 404.  So we set the header to an empty value here.
      format.js { render nothing: true, status: status, content_type: '' }
      format.all { render nothing: true, status: status }
    end
  end

  def setup_visitor
    return true if signed_in?

    # FIXME: ??
    # sign_in(User.create_visitor)
  end

  def login_failure_message
    login_failure 'Incorrect username/email or password'
  end


  def login_failure(error)
    @user = User.new
    flash[:error] = error
    redirect_to "/session/new"
  end

  def default_params
    [:utf8, :authenticity_token, :commit]
  end

  def should_load_intercom
    current_path = request.env['PATH_INFO']
    user_is_logged_in_teacher = current_user && current_user.role == 'teacher'
    user_is_not_a_staff_member = session[:staff_id].nil?
    user_is_not_a_demo_account = current_user && /hello\+(.)*@quill.org/.match(current_user.email).nil?
    not_on_sign_up = !current_path.include?('sign-up')
    @should_load_intercom = user_is_logged_in_teacher && user_is_not_a_staff_member && user_is_not_a_demo_account && not_on_sign_up
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

  protected

  def set_vary_header
     response.headers['Vary'] = 'Accept'
  end

  def set_cache_buster
    response.headers["Cache-Control"] = "no-cache, no-store, max-age=0, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "Fri, 01 Jan 1990 00:00:00 GMT"
  end

  def set_raven_context
    Raven.user_context(id: session[:current_user_id])
    Raven.extra_context(params: params.to_unsafe_h, url: request.url)
  end

  def stick_to_leader_db
    ActiveRecord::Base.connection.stick_to_master!
  end

  def confirm_valid_session
    now = Time.now().in_time_zone.utc
    # Don't do anything if there's no authorized user or session
    return if !current_user || !session
    # if user is staff, logout if last_sign_in was more than 4 hours ago
    if current_user && current_user.role == 'staff' && current_user.last_sign_in
      time_diff = now - current_user.last_sign_in
      time_diff = time_diff.round.abs
      hours = time_diff / 3600
      if hours > 4
        user_id = current_user.id
        auth_credential = AuthCredential.where(user_id: user_id).first
        if auth_credential.present?
          auth_credential.destroy!
        end
        return if !current_user || !session
      end
    end
    # If the user is google authed, but doesn't have a valid refresh
    # token, then we need to invalidate their session
    return reset_session if current_user.google_id && current_user.auth_credential && !current_user.auth_credential&.refresh_token

    # Assuming that the refresh_token expires at (current_user.auth_credential.created_at  + 6 months),
    # we can reset the session whenever (Time.now > (current_user.auth_credential.created_at + 5 months))
    return reset_session if current_user.google_id && current_user.auth_credential && Time.now > (current_user.auth_credential.created_at + 5.months)
  end
end
