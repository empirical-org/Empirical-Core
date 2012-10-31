module Authentication
  extend ActiveSupport::Concern

  included do
    helper_method :current_user, :signed_in?, :sign_out?, :admin?
  end

  def require_user
    if signed_in? then true else redirect_to(root_path) end
  end

  def current_user
    if session[:user_id]
      @current_user ||= User.find(session[:user_id])
    end

    @current_user
  rescue ActiveRecord::RecordNotFound
    sign_out
    nil
  end

  def sign_in user
    session[:user_id] = user.id
    @current_user = user
  end

  def sign_out
    reset_session
    remove_instance_variable :@current_user if defined?(@current_user)
  end

  def signed_in?
    !!current_user
  end

  def signed_out?
    !signed_in?
  end

  def signed_in!
    return if signed_in?
    auth_failed
  end

  def auth_failed
    sign_out
    session[:attempted_path] = request.fullpath
    redirect_to new_session_path, status: :see_other
  end

  def signed_out!

  end

  def admin?
    signed_in? && current_user.role.admin?
  end

  def signed_in_path
    session[:attempted_path] || current_user.role.admin? ? cms_path : root_path
  end
end
