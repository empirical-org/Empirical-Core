module QuillAuthentication
  extend ActiveSupport::Concern

  included do
    helper_method :current_user, :signed_in?, :sign_out?, :admin?, :staff?
  end

  def require_user
    if signed_in? then true else redirect_to(root_path) end
  end

  def current_user
    begin
      if session[:user_id]
        return @current_user ||= User.find(session[:user_id])
      elsif doorkeeper_token
        return User.find_by_id(doorkeeper_token.resource_owner_id) if doorkeeper_token
      else
        authenticate_with_http_basic do |username, password|
          return @current_user ||= User.find_by_token!(username) if username.present?
        end
      end
    rescue ActiveRecord::RecordNotFound
      sign_out
      nil
    end
  end

  def classroom_owner!(classroom_id)
    return if ClassroomsTeacher.exists?(classroom_id: classroom_id, user: current_user, role: 'owner')
    auth_failed
  end

  def classroom_coteacher!(classroom_id)
    return if ClassroomsTeacher.exists?(classroom_id: classroom_id, user: current_user, role: 'coteacher')
    auth_failed
  end

  def classroom_teacher!(classroom_id)
    return if ClassroomsTeacher.exists?(classroom_id: classroom_id, user: current_user)
    auth_failed
  end

  def sign_in(user)
    remote_ip = (request.present? ? request.remote_ip : nil)

    if user.role == 'teacher'
      TestForEarnedCheckboxesWorker.perform_async(user.id)
    end

    if !session[:staff_id] || session[:staff_id] == user.id
      # only kick off login worker if there is no staff id,
      # or if the user getting logged into is staff
      UserLoginWorker.perform_async(user.id, remote_ip) if user&.id
    end
    session[:user_id] = user.id
    session[:admin_id] = user.id if user.admin?
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

  def staff?
    signed_in? && current_user.role.staff?
  end

  def signed_in_path source
    session[:attempted_path] || current_user.role.admin? ? cms_path : root_path
  end

  def updated_account_path
    root_path
  end

  def multiple_classroom_owner?(classrooms_ids)
    owned = ClassroomsTeacher.where(user: current_user, role: 'owner', classroom_id: classrooms_ids.uniq).ids.length
    owned == classrooms_ids.length ? return : auth_failed
  end

  def signed_out_path
    root_path
  end

  def doorkeeper_token
    return @token if instance_variable_defined?(:@token)
    methods = Doorkeeper.configuration.access_token_methods
    @token = Doorkeeper::OAuth::Token.authenticate(request, *methods)
  end
end
