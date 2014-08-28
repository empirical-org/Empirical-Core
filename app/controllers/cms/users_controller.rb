class CMS::UsersController < ApplicationController
  before_filter :signed_in!
  before_filter :admin!

  def index
    @users = if params[:ip].present?
      User.where(ip_address: params[:ip])
    elsif params[:q].present?
      User.basic_search(params[:q])
    else
      User
    end

    @users = @users.order(:id).page(params[:page]).per(100)
  end

  def new
    @user = User.new
  end

  def show
    @user = User.find(params[:id])
  end

  def create
    @user = User.new(user_params)

    if @user.save
      redirect_to cms_users_path
    else
      render :new
    end
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
