# frozen_string_literal: true

class AccountsController < ApplicationController
  before_action :signed_in!, only: [:edit, :update]
  before_action :set_user, only: [:create]

  def new
    if params[:redirect]
      session[:post_sign_up_redirect] = params[:redirect]
    end
    @title = 'Sign Up'
    @teacher_from_google_signup = false
    @js_file = 'session'
  end

  def role
    @js_file = 'session'
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
      if @user.send_newsletter
        @user.subscribe_to_newsletter
      end
      create_referral_if_teacher_and_referrer
      render json: creation_json
    else
      errors = @user.errors
      render json: {errors: errors}, status: 422
    end
  end

  def update
    user_params.delete(:password) unless user_params[:password].present?
    @user = current_user

    if user_params[:username] == @user.username
      validate_username = false
    else
      validate_username = true
    end

    if @user.send_newsletter
      @user.subscribe_to_newsletter
    else
      @user.unsubscribe_from_newsletter
    end

    user_params.merge! validate_username: validate_username
    if @user.update_attributes user_params
      redirect_to updated_account_path
    else
      render 'accounts/edit'
    end
  end

  def edit
    @user = current_user
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
    @user = User.find_by_id(session[:temporary_user_id]) || User.new
  end

  protected def trigger_account_creation_callbacks
    CompleteAccountCreation.new(@user, request.remote_ip).call
  end

  protected def create_referral_if_teacher_and_referrer
    return unless @user.teacher? && request.env['affiliate.tag']

    referrer_user_id = ReferrerUser.find_by(referral_code: request.env['affiliate.tag'])&.user&.id
    ReferralsUser.create(user_id: referrer_user_id, referred_user_id: @user.id) if referrer_user_id
  end
end
