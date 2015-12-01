class ProfilesController < ApplicationController
  before_filter :signed_in!

  def show
    @user = current_user
    if current_user.role == 'student'
      respond_to do |format|
        format.html {student(false)}
        format.json {student(true)}
      end
    else
      send current_user.role
    end
  end

  def update
    # this is called by the 'join classroom' page
    @user = current_user
    @user.update_attributes(user_params)
    JoinClassroomWorker.perform_async(@user.id)
    @user.assign_classroom_activities
    redirect_to profile_path
  end

  def user
    student
  end

  def student(is_json=true)
    puts "is_json : #{is_json}"
    if @classroom = current_user.classroom
      #@units = @classroom.classroom_activities.includes(:unit).map(&:unit).uniq
      @grouped_scores = Profile::Processor.new.query(current_user)
      @student_id = current_user.id

      @next_activity_session = ActivitySession.joins(:classroom_activity)
          .where("activity_sessions.completed_at IS NULL")
          .where("activity_sessions.user_id = ?", current_user.id)
          .order("classroom_activities.due_date DESC")
          .select("activity_sessions.*")
          .first

      @next_activity = @next_activity_session.activity if @next_activity_session.present?

      if is_json
        render json: {grouped_scores: @grouped_scores, next_activity_session: @next_activity_session}
      else
        render 'student'
      end
    else
      render 'join-classroom'
    end
  end

  def teacher
    if @user.classrooms.any?
      redirect_to scorebook_teachers_classrooms_path
    else
      redirect_to new_teachers_classroom_path
    end
  end

  def admin
    render :admin
  end

protected
  def user_params
    params.require(:user).permit(:classcode, :email, :name, :username, :password)
  end
end
