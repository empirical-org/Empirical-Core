class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  include Authentication
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
end
