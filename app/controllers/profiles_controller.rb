class ProfilesController < ApplicationController
  before_filter :signed_in!

  def show
    @user = current_user
    if current_user.role == 'student'
      @firewall_test = true
      @js_file = 'student'
      if current_user.classrooms.any?
        render 'student'
      else
        render 'students_classrooms/add_classroom'
      end
    else
      send current_user.role
    end
  end

  def user
    student
  end

  def student_profile_data
    if current_user.classrooms.any?
      render json: get_student_profile_data(params[:current_classroom_id], params[:current_page].to_i)
    else
      render json: {error: 'Current user has no classrooms'}
    end
  end

  def students_classrooms_json
    render json: {classrooms: current_user.classrooms.includes(:teacher)
      .sort_by { |c|
        c.students_classrooms.find_by_student_id(current_user.id).created_at
      }.reverse.map {|c| c.students_classrooms_json(current_user.id)}}
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

  def get_student_profile_data(classroom_id, current_page)
    classroom = current_classroom(classroom_id)
    grouped_scores, is_last_page = Profile::Processor.new.query(current_user, current_page, classroom.id)
    next_activity_session = current_user.next_activity_session(classroom.id)
    {student: {name: current_user.name, classroom: {name: classroom.name, id: classroom.id, teacher: {name: classroom.teacher.name}}},
     grouped_scores: grouped_scores, is_last_page: is_last_page, next_activity_session: Profile::ActivitySessionSerializer.new(next_activity_session, root: false)}
  end

  def current_classroom(classroom_id = nil)
    if !classroom_id
       current_user.classrooms.last
    else
      Classroom.find(classroom_id.to_i) if !!classroom_id
    end
  end
end
