class SessionsController < ApplicationController
  before_filter :signed_in?, only: [:destroy]

  def create
    if @user = User.find_by_email(params[:user][:email]).try(:authenticate, params[:user][:password])
      sign_in @user
      redirect_to signed_in_path(:signed_in)
    else
      @user = User.new
      flash[:error] = 'bad email/password combination'
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
