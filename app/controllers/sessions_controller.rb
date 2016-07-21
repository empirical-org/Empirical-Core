class SessionsController < ApplicationController
  before_filter :signed_in!, only: [:destroy]
  before_filter :set_cache_buster, only: [:new]

  def create
    params[:user][:email].downcase! unless params[:user][:email].nil?
    @user =  User.find_by_username_or_email(params[:user][:email])

    if @user.nil?
      login_failure_message
    elsif @user.signed_up_with_google
      login_failure 'You signed up with Google, please log in with Google using the link above.'
    elsif @user.password_digest.nil?
      login_failure 'Login failed. Did you sign up with Google? If so, please log in with Google using the link above.'
    elsif @user.authenticate(params[:user][:password])
      if @user.role == 'teacher'
        TestForEarnedCheckboxesWorker.perform_async(@user.id)
      end
      sign_in(@user)
      if params[:redirect].present?
        redirect_to params[:redirect]
      else
        redirect_to profile_path
      end
    else
      login_failure_message
    end
  end

  def destroy
    admin_id = session.delete(:admin_id)
    admin = User.find_by_id(admin_id)
    staff_id = session.delete(:staff_id)
    if admin.present? and (admin != current_user)
      sign_out
      sign_in(admin)
      session[:staff_id] = staff_id unless staff_id.nil? # since it will be lost in sign_out
      redirect_to profile_path
    else # we must go deeper
      staff = User.find_by_id(staff_id)
      if staff.present? and (staff != current_user)
        sign_out
        sign_in(staff)
        redirect_to profile_path
      else
        sign_out
        redirect_to signed_out_path
      end
    end
  end

  def new
    @user = User.new
    session[:role] = nil
  end
end
