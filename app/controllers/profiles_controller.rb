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
    classcode = user_params[:classcode]
    classroom = Classroom.where(code: classcode).first
    Associators::StudentsToClassrooms.run(@user, classroom)
    JoinClassroomWorker.perform_async(@user.id)
    redirect_to profile_path
  end

  def user
    student
  end

  def student(is_json=false, current_classroom = nil)
    if current_user.classrooms.any?
      current_classroom ||= current_user.classrooms.last
      if is_json
        grouped_scores, is_last_page = Profile::Processor.new.query(current_user, params[:current_page].to_i)

        next_activity_session = ActivitySession.joins(classroom_activity: [:unit])
            .where("activity_sessions.completed_at IS NULL")
            .where("activity_sessions.user_id = ?", current_user.id)
            .order("units.created_at DESC")
            .order("classroom_activities.due_date ASC")
            .select("activity_sessions.*")
            .first

        render json: {student: {name: current_user.name,
          classroom: {name: current_classroom.name,
          teacher: {name: current_classroom.teacher.name}}},
          grouped_scores: grouped_scores,
          is_last_page: is_last_page,
          next_activity_session: Profile::ActivitySessionSerializer.new(next_activity_session, root: false)}
      else
        render 'student'
      end
    else
      render 'join-classroom'
    end
  end

  def teacher
    if @user.classrooms_i_teach.any?
      redirect_to dashboard_teachers_classrooms_path
    else
      redirect_to new_teachers_classroom_path
    end
  end

  def admin
    render :admin
  end

  def staff
    render :staff
  end

protected
  def user_params
    params.require(:user).permit(:classcode, :email, :name, :username, :password)
  end
end
