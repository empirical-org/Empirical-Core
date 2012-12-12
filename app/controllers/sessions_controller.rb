class SessionsController < ApplicationController
  before_filter :signed_in?, only: [:destroy]

  def create
    if @signing_in = User.find_by_email(params[:user][:email]).try(:authenticate, params[:user][:password])
      sign_in @signing_in
      redirect_to root_path
    else
      @signing_in = @signing_up = User.new
      flash[:error] = 'bad email/password combination'
      render :new
    end
  end

  def destroy
    session.delete(:user_id)
    redirect_to root_url, notice: 'Logged Out'
  end

  def new
    @signing_in = @signing_up = User.new
  end
end
