class PasswordResetController < ApplicationController

  before_filter :set_title

  def index
    @user = User.new
  end

  def create
    user = User.find_by_email(params[:user][:email])

    if user && params[:user][:email].present?
      if user.google_id
        render json: { message: 'Oops! You have a Google account. Log in that way instead.', type: 'email' }, status: 401
      elsif user.clever_id
        render json: { message: 'Oops! You have a Clever account. Log in that way instead.', type: 'email' }, status: 401
      else
        user.refresh_token!
        UserMailer.password_reset_email(user).deliver_now!
        flash[:notice] = 'We sent you an email with instructions on how to reset your password.'
        flash.keep(:notice)
        render json: { redirect: '/password_reset'}
      end
    else
      @user = User.new
      render json: { message: 'An account with this email does not exist. Try again.', type: 'email' }, status: 401
    end
  end

  def show
    @user = User.find_by_token(params[:id])
    if @user.nil?
      redirect_to password_reset_index_path, notice: 'That link is no longer valid.'
    end
  end

  def update
    @user = User.find_by_token!(params[:id])
    @user.update_attributes params[:user].permit(:password)
    @user.save validate: false
    sign_in @user
    flash[:notice] = 'Your password has been updated.'
    flash.keep(:notice)
    render json: { redirect: '/profile'}
  end

  private def set_title
    @title = "Password Reset"
  end

end
