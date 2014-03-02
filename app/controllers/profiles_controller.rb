class ProfilesController < ApplicationController
  before_filter :signed_in!

  def show
    @user = current_user
    send current_user.role
  end

  def update
    @user = current_user
    @user.update_attributes(user_params)
    redirect_to profile_path
  end

  def user
    student
  end

  def student
    @classroom = current_user.classroom
    @chapters = []
    @classroom_chapters = @classroom.classroom_chapters.sort{|x,y| x.due_date <=> y.due_date}
    @classroom_chapters.each { |cc| @chapters << cc.chapter }
    render :student
  end

  def teacher
    redirect_to teachers_classrooms_path
  end

  def admin
    render :admin
  end

protected
  def user_params
    params.require(:user).permit(:classcode, :email, :name, :username, :password, :password_confirmation)
  end
end
