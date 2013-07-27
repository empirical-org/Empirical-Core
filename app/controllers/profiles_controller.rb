class ProfilesController < ApplicationController
  before_filter :signed_in!

  def show
    @user = current_user
    @roster = User.where(role: 'user', classcode: current_user.classcode).order(:name)
    send current_user.role
  end

  def user
    student
  end

  def student
    render :student
  end

  def teacher
    render :teacher
  end

  def admin
    render :admin
  end
end
