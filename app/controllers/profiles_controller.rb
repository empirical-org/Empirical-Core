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

  def student(is_json=false)
    if current_user.classrooms.any?
      current_classroom_id = params['current_classroom_id'] || current_user.classrooms.last.id
      current_classroom_id = current_classroom_id.to_i
      current_classroom = Classroom.find current_classroom_id
      if is_json
        grouped_scores, is_last_page = Profile::Processor.new.query(current_user, params[:current_page].to_i, current_classroom_id)
        next_activity_session = ActivitySession.joins(classroom_activity: [:unit])
            .where("classroom_activities.classroom_id = ?", current_classroom_id)
            .where("activity_sessions.completed_at IS NULL")
            .where("activity_sessions.user_id = ?", current_user.id)
            .order("units.created_at DESC")
            .order("classroom_activities.due_date ASC")
            .select("activity_sessions.*")
            .first

        render json: {student: {name: current_user.name,
          classroom: {name: current_classroom.name,
          id: current_classroom_id,
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

  def students_classrooms
    render json: {classrooms: current_user.classrooms.reverse.map {|c| c.students_classrooms(current_user.id)}}
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
