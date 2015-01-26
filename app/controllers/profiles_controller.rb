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

      # classroom_activities = []
      # @units.each do |unit|
      #   classroom_activities << unit.classroom_activities.joins(:activity).where(<<-SQL, current_user.id)
      #   classroom_activities.assigned_student_ids IS NULL OR
      #   classroom_activities.assigned_student_ids = '{}' OR
      #   ? = ANY (classroom_activities.assigned_student_ids)
      #   SQL
      # end
      # classroom_activities.flatten!


      # activity_sessions = classroom_activities.map{|ca| ca.try(:session_for, current_user)}
      
      # @completed_activity_sessions = current_user.percentages_by_classification
      
      # completed_activity_ids = @completed_activity_sessions.map(&:activity_id)

      # #@incomplete_activity_sessions = activity_sessions.select{|as| as.completed_at.nil? and !completed_activity_ids.include?(as.activity_id)}
      # @incomplete_activity_sessions = activity_sessions.select{|as| as.completed_at.nil?}
      
      
      # @incomplete_activities = @incomplete_activity_sessions.map(&:activity)

      # @next_activity = classroom_activities
      #                   .find_all{|ca| @incomplete_activities.include?(ca.activity) }
      #                   .sort {|a,b| a.due_date <=> b.due_date }
      #                   .first.try(:activity)

   
      @next_activity_session = ActivitySession.joins(:classroom_activity)
          .where("activity_sessions.user_id = ?", current_user.id)
          .order("classroom_activities.due_date DESC")
          .select("activity_sessions.*")
          .first

      @next_activity = @next_activity_session.activity if @next_activity_session.present?




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
