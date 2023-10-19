# frozen_string_literal: true

class SessionsController < ApplicationController
  include CleverAuthable

  CLEAR_ANALYTICS_SESSION_KEY = "clear_analytics_session"

  around_action :force_writer_db_role, only: [:destroy]

  before_action :signed_in!, only: [:destroy]

  def new
    @js_file = 'login'
    @user = User.new
    @title = 'Log In'
    @clever_link = clever_link
    @google_offline_access_expired = session.delete(ApplicationController::GOOGLE_OFFLINE_ACCESS_EXPIRED)
    @expired_session_redirect = session.delete(ApplicationController::EXPIRED_SESSION_REDIRECT)
    session[:role] = nil
    session[ApplicationController::POST_AUTH_REDIRECT] = params[:redirect] if params[:redirect]
  end

  # rubocop:disable Metrics/CyclomaticComplexity
  def login_through_ajax
    email_or_username = params[:user][:email].downcase.strip unless params[:user][:email].nil?
    @user =  User.find_by_username_or_email(email_or_username)
    if @user.nil? || @user.sales_contact?
      render json: {message: 'An account with this email or username does not exist. Try again.', type: 'email'}, status: :unauthorized
    elsif @user.google_id && @user.password_digest.nil?
      render json: {message: 'Oops! You have a Google account. Log in that way instead.', type: 'email'}, status: :unauthorized
    elsif @user.clever_id
      render json: {message: 'Oops! You have a Clever account. Log in that way instead.', type: 'email'}, status: :unauthorized
    elsif @user.password_digest.nil?
      render json: {message: 'Something went wrong verifying your password. Please use the "Forgot password?" link below to reset it.', type: 'email'}, status: :unauthorized
    elsif @user.authenticate(params[:user][:password])
      sign_in(@user)

      session[ApplicationController::KEEP_ME_SIGNED_IN] = params[:keep_me_signed_in]

      if session[ApplicationController::POST_AUTH_REDIRECT].present?
        url = session[ApplicationController::POST_AUTH_REDIRECT]
        session.delete(ApplicationController::POST_AUTH_REDIRECT)
        render json: {redirect: url}
      elsif params[:redirect].present?
        render json: {redirect: URI.parse(params[:redirect]).path}
      elsif session[:attempted_path]
        render json: {redirect: URI.parse(session.delete(:attempted_path)).path}
      elsif @user.auditor? && @user.subscription&.school_subscription?
        render json: {redirect: '/subscriptions'}
      else
        render json: {redirect: '/'}
      end
    else
      render json: {message: 'Wrong password. Try again or click Forgot password to reset it.', type: 'password'}, status: :unauthorized
    end
  end
  # rubocop:enable Metrics/CyclomaticComplexity

  def destroy
    admin_id = session.delete(:admin_id)
    admin = User.find_by_id(admin_id)
    staff_id = session.delete(:staff_id)
    expires = Time.current
    cookies[:webinar_banner_recurring_closed] = { expires: expires }
    cookies[:webinar_banner_one_off_closed] = { expires: expires }
    cookies[:student_feedback_banner_1_closed] = { expires: expires }
    if admin.present? and (admin != current_user)
      sign_out
      sign_in(admin)
      session[:staff_id] = staff_id unless staff_id.nil? # since it will be lost in sign_out
      redirect_to profile_path
    else # we must go deeper
      staff = User.find_by_id(staff_id)
      if staff.present? and (staff != current_user)
        sign_out
        sign_in(staff)
        redirect_to cms_users_path
      else
        sign_out
        # Wherever our user eventually lands after logout, we want to do some special stuff
        # So we set a session value here for the final controller to pick up and convert into
        # a variable for the view
        session[CLEAR_ANALYTICS_SESSION_KEY] = true
        redirect_to signed_out_path
      end
    end
  end

  def failure
    login_failure_message
    # redirect_to signed_out_path
  end

  def set_post_auth_redirect
    session[ApplicationController::POST_AUTH_REDIRECT] = params[ApplicationController::POST_AUTH_REDIRECT]
    render json: {}
  end

  def finish_sign_up
    if session[ApplicationController::POST_AUTH_REDIRECT]
      url = session[ApplicationController::POST_AUTH_REDIRECT]
      session.delete(ApplicationController::POST_AUTH_REDIRECT)
      return redirect_to url
    end
    redirect_to profile_path
  end
end
