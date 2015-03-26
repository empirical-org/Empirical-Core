class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  include QuillAuthentication
  helper CMS::Helper

  # FIXME: disabled till it's clear what this does
  # before_action :setup_visitor

  def admin!
    return if current_user.try(:admin?)
    auth_failed
  end

  def teacher!
    return if current_user.try(:teacher?)
    auth_failed
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
    render_error(404)
  end

  def render_error(status)
    respond_to do |format|
      format.html { render template: "errors/error_#{status}", layout: 'layouts/application', status: status }
      format.all { render nothing: true, status: status }
    end
  end

  def setup_visitor
    return true if signed_in?

    # FIXME: ??
    # sign_in(User.create_visitor)
  end

  protected

  def set_vary_header
     response.headers['Vary'] = 'Accept'
  end
end
