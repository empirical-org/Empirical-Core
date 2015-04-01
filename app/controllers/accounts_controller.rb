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

    @user.attributes = user_params
    @user.name = capitalized_name
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

  def capitalized_name
    result = user_params[:name]
    if user_params[:name].present?
      f,l = user_params[:name].split(/\s+/)
      if f.present? and l.present?
        result = "#{f.capitalize} #{l.capitalize}"
      else
        result = user_params[:name].capitalize
      end
    end
    result
  end
end