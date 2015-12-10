class Cms::UsersController < ApplicationController
  before_filter :signed_in!
  before_filter :admin!
  before_action :set_user, only: [:show, :show_json, :edit, :update, :destroy]

  def index
    @q = User.includes([:schools, :classroom]).search(params[:q])

    @users = @q.result(distinct: true).page(params[:page]).per(100)
  end

  def search
    binding.pry
    index
    render :index
  end

  def new
    @user = User.new
  end

  def show
  end

  def show_json
    render json: @user
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
  end

  def update
    if @user.teacher?
      response = @user.update_teacher params
      render json: response
    else
      if @user.update_attributes(user_params)
        redirect_to cms_users_path, notice: 'User was successfully updated.'
      else
        render action: 'edit'
      end
    end
  end

  def destroy
    @user.destroy
    redirect_to cms_users_path
  end

protected
  def set_user
    @user = User.find params[:id]
  end

  def user_params
    params.require(:user).permit!
  end
end
