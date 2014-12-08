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
      
      activity_sessions = @classroom.classroom_activities.map{|ca| ca.try(:session_for, current_user)}
      
      @incomplete_activity_sessions = activity_sessions.select{|as| as.completed_at.nil?}
      

      @completed_activity_sessions = current_user.percentages_by_classification
      
      #@incomplete_activities = @units.collect(&:activities).flatten - @completed_activity_sessions.collect(&:activity)
      @incomplete_activities = Activity.find @incomplete_activity_sessions.map{|as| as.activity_id} #  @incomplete_activity_sessions.collect(&:activity)

      # @next_activity = @units.collect(&:classroom_activities).flatten.
      #                   find_all { |ca| !@completed_activity_sessions.collect(&:activity).include?(ca.activity) }.
      #                   sort {|a, b| b.due_date <=> a.due_date}.first.try(:activity)

      @next_activity = @units.collect(&:classroom_activities).flatten.
              find_all { |ca| @incomplete_activities.include?(ca.activity) }.
              sort {|a,b| b.due_date <=> a.due_date}.first.try(:activity)


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
