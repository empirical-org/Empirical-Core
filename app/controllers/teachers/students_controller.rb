class Teachers::StudentsController < ApplicationController
  before_filter :teacher!
  before_filter :authorize!

  def create
    valid_names = Creators::StudentCreator.check_names(params)
    if valid_names[:status] == 'failed'
      flash[:notice] = valid_names[:notice]
      redirect_to teachers_classroom_invite_students_path(@classroom)
    else
      @student = Creators::StudentCreator.create_student(user_params, @classroom.id)
    end
    InviteStudentWorker.perform_async(current_user.id, @student.id)
    respond_to do |format|
      format.js {render 'create'}
      format.html {redirect_to teachers_classroom_invite_students_path(@classroom)}
    end
  end

  def edit
    # if teacher was the last user to reset the students password, we will show that password in the class manager to the teacher
    @was_teacher_the_last_user_to_reset_students_password = (@student.password.present? && @student.authenticate(@student.last_name))
  end

  def index
  end

  def reset_password
    @student.generate_password
    @student.save
    redirect_to edit_teachers_classroom_student_path(@classroom, @student)
  end

  def update
    if user_params[:username] == @student.username
      validate_username = false
    else
      validate_username = true
    end
    user_params.merge!(validate_username: validate_username)
    if @student.update_attributes(user_params)
      #head :ok
      redirect_to teachers_classroom_students_path(@classroom)
    else
      render text: @student.errors.full_messages.join(', '), status: :unprocessable_entity
    end
  end

  def destroy
    @student.destroy
    redirect_to teachers_classroom_students_path(@classroom)
  end

protected

  # TODO: this is copied from Teachers::ClassroomsController#authorize!
  #       consider absracting using inheritance e.g. Teachers::BaseClassroomController
  def authorize!
    @classroom = Classroom.find(params[:classroom_id])
    auth_failed unless @classroom.teacher == current_user
    params[:id] = params[:student_id] if params[:student_id].present?
    @student = @classroom.students.find(params[:id]) if params[:id].present?
  end

  def user_params
    params.require(:user).permit!
  end
end
