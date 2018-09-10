class AccountsController < ApplicationController
  before_filter :signed_in!, only: [:edit, :update]
  before_filter :set_cache_buster, only: [:new]
  before_filter :set_user, only: [:create]

  def new
    ClickSignUpWorker.perform_async
    session[:role] = nil
    session[:post_sign_up_redirect] = params[:redirect]
    @teacherFromGoogleSignUp = false
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
      @user.subscribe_to_newsletter
      create_referral_if_teacher_and_referrer
      render json: creation_json
    else
      render json: {errors: @user.errors}, status: 422
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

protected

  def user_params
    params.require(:user).permit(
                                 :classcode,
                                 :email,
                                 :name,
                                 :username,
                                 :password,
                                 :terms_of_service,
                                 :send_newsletter,
                                 :school_ids)
  end

  def creation_json
    if session[:post_sign_up_redirect]
      { redirectPath: session.delete(:post_sign_up_redirect) }
    elsif @user.has_outstanding_coteacher_invitation?
      { redirectPath: teachers_classrooms_path }
    else
      @user
    end
  end

  def set_user
    @user = User.find_by_id(session[:temporary_user_id]) || User.new
  end

  def trigger_account_creation_callbacks
    AccountCreationCallbacks.new(@user, request.remote_ip).trigger
  end

  def create_referral_if_teacher_and_referrer
    if @user.teacher? && request.env[ReferrerUser::ENV_VARIABLE_NAME]
      referrer_user_id = ReferrerUser.find_by(referral_code: request.env[ReferrerUser::ENV_VARIABLE_NAME])&.user&.id
      ReferralsUser.create(user_id: referrer_user_id, referred_user_id: @user.id) if referrer_user_id
    end
  end



end
