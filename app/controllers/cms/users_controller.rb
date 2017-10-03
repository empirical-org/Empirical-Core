class Cms::UsersController < ApplicationController
  before_filter :signed_in!
  before_filter :staff!
  before_action :set_user, only: [:show, :show_json, :edit, :update, :destroy]

  def index
    @q = User.where(id: (1..100).to_a).includes([:school, :classrooms]).search(params[:q])
    @users = @q.result(distinct: true).page(params[:page]).per(100)
  end

  def search
    @q = User.includes([:school, :classrooms]).search(params[:q])
    @q.sorts = 'created_at desc' if @q.sorts.empty?
    @users = @q.result(distinct: true).page(params[:page]).per(100)
    render :index
  end

  def new
    @user = User.new
  end

  def show
  end

  def show_json
    render json: @user.generate_teacher_account_info
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
    session[:staff_id] = current_user.id
    super(User.find(params[:id]))
    redirect_to profile_path
  end

  def make_admin
    User.find(params[:id]).update(role: 'admin')
    redirect_to :back
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

  def clear_data
    User.find(params[:id]).clear_data
    redirect_to cms_users_path
  end

  def destroy
    @user.destroy
  end

protected
  def set_user
    @user = User.find params[:id]
  end

  def user_params
    params.require(:user).permit!
  end
end
