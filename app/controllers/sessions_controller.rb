class SessionsController < ApplicationController
  before_filter :signed_in!, only: [:destroy]

  def create
    if @user = User.authenticate(params[:user])
      sign_in @user
      redirect_to profile_path
    else
      @user = User.new
      flash[:error] = 'Incorrect username/email or password'
      render :new
    end
  end

  def destroy
    admin_id = session.delete(:admin_id)
    sign_out

    if user = User.find_by_id(admin_id)
      sign_in user
      redirect_to profile_path
    else
      redirect_to signed_out_path, notice: 'Logged Out'
    end
  end

  def new
    @user = User.new
  end
end
