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
      @units = @classroom.units.includes(classroom_activities: [], activities: :classification)
      #@incomplete_activity_sessions = (ActivitySession.where(user_id: current_user.id)).incomplete
      @incomplete_activity_sessions = current_user.activity_sessions.for_classroom(@classroom).incomplete.to_a
      activity = Activity.find 105
      as = @incomplete_activity_sessions.find {|s| s.activity == activity}
      puts '__incomplete activity sessions: lolz '
      puts @incomplete_activity_sessions.to_yaml
      puts '__result of searching for activity session with activity Activity.find(105): '
      puts as.to_yaml

      @completed_activity_sessions = current_user.percentages_by_classification
      @incomplete_activities = @units.collect(&:activities).flatten - @completed_activity_sessions.collect(&:activity)
      @next_activity = @units.collect(&:classroom_activities).flatten.
                        find_all { |ca| !@completed_activity_sessions.collect(&:activity).include?(ca.activity) }.
                        sort {|a, b| b.due_date <=> a.due_date}.first.try(:activity)
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
