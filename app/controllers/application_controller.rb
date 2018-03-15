class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  include QuillAuthentication

  #helper CMS::Helper

  # FIXME: disabled till it's clear what this does
  # before_action :setup_visitor
  before_action :should_load_intercom

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
    user_is_logged_in_teacher = current_user && current_user.role == 'teacher'
    user_is_not_a_staff_member = session[:staff_id].nil?
    user_is_not_a_demo_account = current_user && /hello\+(.)*@quill.org/.match(current_user.email).nil?
    @should_load_intercom = user_is_logged_in_teacher && user_is_not_a_staff_member && user_is_not_a_demo_account
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

end
