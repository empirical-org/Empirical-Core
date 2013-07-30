class AccountsController < ApplicationController
  before_filter :signed_in!, only: [:edit, :update]

  def new
    @user = User.new
  end

  def create
    role = params[:user].delete(:role)
    @user = User.new(user_params)
    @user.safe_role_assigment(role)
    # binding.pry

    if @user.after_initialize!
      sign_in @user
      redirect_to profile_path
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
    params.require(:user).permit(:classcode, :email, :name)
  end
end
