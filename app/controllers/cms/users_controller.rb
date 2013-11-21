class CMS::UsersController < ApplicationController
  before_filter :signed_in!
  before_filter :admin!, only: [:sign_in]

  def index
    @users = User.all
  end

  def new
    @user = User.new
  end

  def sign_in
    session[:admin_id] = current_user.id
    super(User.find(params[:id]))
    redirect_to profile_path
  end

  def edit
    @user = User.find(params[:id])
  end

  def update
    @user = User.find(params[:id])

    if @user.update_attributes(user_params)
      redirect_to cms_users_path, notice: 'User was successfully updated.'
    else
      render action: 'edit'
    end
  end

  def destroy
    @user = User.find(params[:id])
    @user.destroy
    redirect_to cms_users_path
  end

protected

  def user_params
    params.require(:user).permit!
  end
end
