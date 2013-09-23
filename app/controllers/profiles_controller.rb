class ProfilesController < ApplicationController
  # before_filter :signed_in!

  def show
    @user = current_user
    send current_user.role
  end

  def user
    student
  end

  def student
    @classroom = current_user.classroom
    render :student
  end

  def teacher
    redirect_to teachers_classrooms_path
  end

  def admin
    render :admin
  end
end
