class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  include QuillAuthentication
  helper CMS::Helper

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
    binding.pry
  end

  def render_error(status, exception)
    respond_to do |format|
      format.html { render template: "errors/error_#{status}", layout: 'layouts/application', status: status }
      format.all { render nothing: true, status: status }
    end
  end
end
