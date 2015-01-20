class ProfilesController < ApplicationController
  before_filter :signed_in!

  def show
    @user = current_user
    send current_user.role
  end

  def update
    @user = current_user
    @user.update_attributes(user_params)
    StudentProfileCache.invalidate(@user) if @user.role.student?
    redirect_to profile_path
  end

  def user
    student
  end

  def student
    if @classroom = current_user.classroom
      @units = @classroom.classroom_activities.map(&:unit).uniq

      @next_activity_session = ActivitySession.joins(:classroom_activity)
          .where("activity_sessions.user_id = ?", current_user.id)
          .order("classroom_activities.due_date DESC")
          .select("activity_sessions.*")
          .first

      @next_activity = @next_activity_session.activity

      render 'student', layout: 'scorebook'
    else
      @section = Section.find_by_id(params[:section_id]) || Section.first
      @topics = @section.topics.includes(:activities)
      render 'join-classroom'
    end
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
