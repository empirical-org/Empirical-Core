class Teachers::StudentsController < ApplicationController
  before_filter :teacher!
  before_filter :authorize!

  def create
    valid_names = Creators::StudentCreator.check_names(params)
    if valid_names[:status] == 'failed'
      # flash[:notice] = valid_names[:notice]
      # redirect_to invite_students_teachers_classrooms_path
      render status: 400, json: {error: valid_names[:notice]}.to_json
    else
      @student = Creators::StudentCreator.create_student(user_params, @classroom.id)
      classroom_activities = ClassroomActivity.where(classroom_id: @classroom.id)
      classroom_activities.each { |ca| ca.validate_assigned_student(@student.id) }
      Associators::StudentsToClassrooms.run(@student, @classroom)
      render json: @student
    end
  end

  def edit
    edit_page_variables
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
      flash.now[:error] = @student.errors.full_messages.join('. ')
      edit_page_variables
      render :edit
    end
  end

  def destroy
    referred_from_class_path = env["HTTP_REFERER"].include? 'teachers/classrooms/'
    DeleteStudentWorker.perform_async(current_user.id, referred_from_class_path)
    @student.destroy
    redirect_to teachers_classroom_students_path(@classroom)
  end

protected

  # TODO: this is copied from Teachers::ClassroomsController#authorize!
  #       consider absracting using inheritance e.g. Teachers::BaseClassroomController
  def authorize!
    @classroom = Classroom.find(params[:classroom_id])
    auth_failed unless @classroom.owner == current_user
    params[:id] = params[:student_id] if params[:student_id].present?
    @student = @classroom.students.find(params[:id]) if params[:id].present?
  end

  def user_params
    params.require(:user).except!(:role).permit!
  end

  def edit_page_variables
    # if teacher was the last user to reset the students password, we will show that password in the class manager to the teacher
    @was_teacher_the_last_user_to_reset_students_password =  (@student.password_digest && @student.authenticate(@student.last_name))
    @teacher_created_student = @student.username.split('@').last == @classroom.code
    @sign_up_method = {
      "Clever User": @student.clever_id,
      "Google Sign On User": @student.signed_up_with_google,
      "Student Email": @student.email
    }
  end

end
