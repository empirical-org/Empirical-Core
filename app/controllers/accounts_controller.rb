class AccountsController < ApplicationController
  before_filter :signed_in!, only: [:edit, :update]

  def new
    @user = User.new(role: params[:as] || 'student')
  end

  # creates a new user from params.
  # if a temporary_user_id is present in the session, it uses that
  # user record instead of creating a new one.
  def create
    role = params[:user].delete(:role)
    @user = User.find_by_id(session[:temporary_user_id]) || User.new

    fix_full_name_in_first_name_field
    capitalize_first_and_last_name
    @user.attributes = user_params
    @user.safe_role_assignment(role)

    if @user.save
      sign_in @user

      AccountCreationWorker.perform_async(@user.id)

      @user.subscribe_to_newsletter

      redirect_to profile_path
    else
      render 'accounts/new'
    end
  end

  def update
    user_params.delete(:password) unless user_params[:password].present?
    @user = current_user
    @user.attributes = user_params

    if @user.save
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
    params.require(:user).permit(:classcode, :email, :name, :username, :password, :password_confirmation, :newsletter, :terms_of_service, :school_ids)
  end


  # below two methods are repeated in students_controller. need to abstract them into user_model, but first must clear up name splitting db issue
  def capitalize_first_and_last_name 
    # make sure this is called after fix_full_name_in_first_name_field
    user_params[:first_name].capitalize!
    user_params[:last_name].capitalize!
  end

  def fix_full_name_in_first_name_field
    if user_params[:last_name].blank? && (f,l = user_params[:first_name].split(/\s+/)).length > 1
      user_params[:first_name] = f
      user_params[:last_name] = l
    end
  end


end
