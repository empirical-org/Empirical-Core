# frozen_string_literal: true

class AccountsController < ApplicationController
  before_action :set_js_file, only: [:new, :role, :edit]
  before_action :set_user, only: [:create]
  before_action :set_user_by_token, only: [:update, :edit]

  def new
    if params[:redirect]
      session[:post_sign_up_redirect] = params[:redirect]
    end
    @title = 'Sign Up'
    @teacher_from_google_signup = false
  end

  def role
    role = params[:role]
    session[:role] = role if ['student', 'teacher'].include? role
    render json: {}
  end

  # creates a new user from params.
  # if a temporary_user_id is present in the session, it uses that
  # user record instead of creating a new one.
  def create
    role = params[:user].delete(:role)
    @user.attributes = user_params
    @user.safe_role_assignment(role)
    @user.validate_username = true
    if @user.save
      sign_in @user
      trigger_account_creation_callbacks
      create_referral_if_teacher_and_referrer
      render json: creation_json
    else
      errors = @user.errors
      render json: {errors: errors}, status: 422
    end
  end

  def edit
    @user = User.find_by_token(params[:id])
    return if @user.present?

    redirect_to profile, notice: "Sorry, this link has expired. Please contact your Quill admin or the <a href='mailto:hello@quill.org'>Quill support team</a>".html_safe
  end

  def update
    if @user.update(update_user_params)
      sign_in @user
      @user.update(token: nil)
      render json: creation_json
    else
      errors = @user.errors
      render json: {errors: errors}, status: 422
    end

  end

  protected def user_params
    params.require(:user).permit(
                                 :account_type,
                                 :classcode,
                                 :email,
                                 :name,
                                 :password,
                                 :school_ids,
                                 :send_newsletter,
                                 :terms_of_service,
                                 :username)
  end

  protected def update_user_params
    params.require(:user).permit(:name, :password)
end

  protected def creation_json
    if session[:post_sign_up_redirect]
      { redirect: session.delete(:post_sign_up_redirect) }
    elsif @user.has_outstanding_coteacher_invitation?
      { redirect: teachers_classrooms_path }
    else
      { redirect: '/profile'}
    end
  end

  protected def set_user
    @user = User.find_by(email: user_params[:email], role: User::SALES_CONTACT) || User.find_by_id(session[:temporary_user_id]) || User.new
  end

  protected def set_user_by_token
    @user = User.find_by_token(params[:id])
  end

  protected def trigger_account_creation_callbacks
    CompleteAccountCreation.new(@user, request.remote_ip).call
  end

  protected def create_referral_if_teacher_and_referrer
    return unless @user.teacher? && request.env['affiliate.tag']

    referrer_user_id = ReferrerUser.find_by(referral_code: request.env['affiliate.tag'])&.user&.id
    ReferralsUser.create(user_id: referrer_user_id, referred_user_id: @user.id) if referrer_user_id
  end

  protected def set_js_file
    @js_file = 'session'
  end
end
