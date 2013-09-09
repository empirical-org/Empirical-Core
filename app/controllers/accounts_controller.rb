class AccountsController < ApplicationController
  before_filter :signed_in!, only: [:edit, :update]

  def new
    @user = User.new
  end

  def create
    role = params[:user].delete(:role)

    unless @user = User.find_by_id(session[:temporary_user_id])
      @user = User.new
    end

    @user.attributes = user_params
    @user.safe_role_assignment(role)

    if @user.after_initialize!
      sign_in @user
      redirect_to profile_path, flash: { mixpanel: "account created" }
    else
      render 'accounts/new'
    end
  end

  def update
    params[:user].delete(:password) unless params[:user][:password].present?
    @user = current_user
    @user.attributes = params[:user]

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
    params.require(:user).permit(:classcode, :email, :name, :password, :password_confirmation)
  end
end
