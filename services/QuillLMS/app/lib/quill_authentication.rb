# frozen_string_literal: true

module QuillAuthentication
  extend ActiveSupport::Concern
  include ActionController::Helpers

  CLEVER_REDIRECT = :clever_redirect
  GOOGLE_REDIRECT = :google_redirect
  GOOGLE_OR_CLEVER_JUST_SET = :google_or_clever_just_set

  included do
    helper_method :current_user, :signed_in?, :sign_out?, :admin?, :staff?, :previewing_student_dashboard?, :viewing_demo_account?, :signed_in_outside_demo?
  end

  def require_user
    signed_in!
  end

  # rubocop:disable Metrics/CyclomaticComplexity
  def current_user
    if session[:preview_student_id]
      @current_user ||= User.find(session[:preview_student_id])
    elsif session[:demo_id]
      @current_user ||= User.find(session[:demo_id])
    elsif session[:user_id]
      @current_user ||= User.find(session[:user_id])
    elsif doorkeeper_token
      User.find_by_id(doorkeeper_token.resource_owner_id)
    else
      authenticate_with_http_basic do |username, password|
        return @current_user ||= User.find_by_token!(username) if username.present?
      end
    end
  rescue ActiveRecord::RecordNotFound
    sign_out
    nil
  end
  # rubocop:enable Metrics/CyclomaticComplexity

  def classroom_owner!(classroom_id)
    return if ClassroomsTeacher.exists?(classroom_id: classroom_id, user: current_user, role: 'owner')

    auth_failed
  end

  def classroom_coteacher!(classroom_id)
    return if ClassroomsTeacher.exists?(classroom_id: classroom_id, user: current_user, role: 'coteacher')

    auth_failed
  end

  def classroom_teacher!(classroom_id)
    return if ClassroomsTeacher.exists?(
      classroom_id: classroom_id,
      user: current_user
    )

    auth_failed
  end

  def sign_in(user)
    TestForEarnedCheckboxesWorker.perform_async(user.id) if user.teacher?

    unless staff_impersonating_user?(user)
      user.update(ip_address: request&.remote_ip, last_sign_in: Time.current)
      UserLoginWorker.perform_async(user.id)
    end

    session[:user_id] = user.id
    session[:admin_id] = user.id if user.admin?
    @current_user = user
  end

  def current_user_demo_id=(demo_id)
    session[:demo_id] = demo_id
    if demo_id
      Analyzer.new.track(current_user, SegmentIo::BackgroundEvents::VIEWED_DEMO)
      @current_user = User.find(session[:demo_id])
    else
      @current_user = User.find(session[:user_id])
    end
  end

  def preview_student_id=(student_id)
    session[:preview_student_id] = student_id
    if student_id
      @current_user = User.find(session[:preview_student_id])
    elsif session[:demo_id].present?
      @current_user = User.find(session[:demo_id])
    else
      @current_user = User.find(session[:user_id])
    end
  end

  def previewing_student_dashboard?
    !session[:preview_student_id].nil?
  end

  def viewing_demo_account?
    session[:demo_id].present?
  end

  def signed_in_outside_demo?
    session[:user_id].present?
  end

  def sign_out
    reset_session
    remove_instance_variable :@current_user if defined?(@current_user)
  end

  def signed_in?
    !current_user.nil?
  end

  def signed_out?
    !signed_in?
  end

  def signed_in!
    return if signed_in?

    auth_failed
  end

  def auth_failed(hard: true)
    if hard
      sign_out
      session[:attempted_path] = request.fullpath
      redirect_to(new_session_path, status: :see_other)
    else
      redirect_to(profile_path, notice: "404")
    end

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

  private def staff_impersonating_user?(user)
    session[:staff_id].present? && session[:staff_id] != user.id
  end
end
