# frozen_string_literal: true

class Teachers::StudentsController < ApplicationController
  before_action :teacher!
  before_action :authorize!

  def create
    valid_names = Creators::StudentCreator.check_names(params)
    if valid_names[:status] == 'failed'
      # flash[:notice] = valid_names[:notice]
      # redirect_to invite_students_teachers_classrooms_path
      render status: 400, json: {error: valid_names[:notice]}.to_json
    else
      @student = Creators::StudentCreator.create_student(user_params, @classroom.id)
      classroom_units = ClassroomUnit.where(classroom_id: @classroom.id)
      classroom_units.each { |cu| cu.validate_assigned_student(@student.id) }
      Associators::StudentsToClassrooms.run(@student, @classroom)
      render json: @student
    end
  end

  def edit
    redirect_to teachers_classrooms_path
  end

  def index
    redirect_to teachers_classrooms_path
  end

  def update
    respond_to do |format|
      format.html {
        if user_params[:username] == @student.username
          validate_username = false
        else
          validate_username = true
        end
        user_params.merge!(validate_username: validate_username)
        if @student.update(user_params)
          #head :ok
          redirect_to teachers_classroom_students_path(@classroom)
        else
          flash.now[:error] = @student.errors.full_messages.join('. ')
          edit_page_variables
          render :edit
        end
      }
      format.json {
        @student.validate_username = true
        @student.update(user_params)
        if @student.errors.any?
          render json: { errors: @student.errors }
        else
          render json: {}
        end
      }
    end

  end

  def destroy
    referred_from_class_path = env["HTTP_REFERER"].include? 'teachers/classrooms/'
    DeleteStudentWorker.perform_async(current_user.id, referred_from_class_path)
    @student.destroy
    redirect_to teachers_classroom_students_path(@classroom)
  end

  def merge_student_accounts
    primary_account = User.find(params[:primary_account_id])
    secondary_account = User.find(params[:secondary_account_id])
    primary_account.merge_student_account(secondary_account, current_user.id)
    render json: {}
  end

  def move_students
    old_classroom = @classroom
    new_classroom = Classroom.find(params[:new_classroom_id])
    students = User.where(id: params[:student_ids])
    students.each do |student|
      student.move_student_from_one_class_to_another(old_classroom, new_classroom)
    end
    render json: {}
  end

  # TODO: this is copied from Teachers::ClassroomsController#authorize!
  #       consider absracting using inheritance e.g. Teachers::BaseClassroomController
  protected def authorize!
    @classroom = Classroom.find(params[:classroom_id])
    auth_failed unless @classroom.teachers.include?(current_user)
    params[:id] = params[:student_id] if params[:student_id].present?
    @student = @classroom.students.find(params[:id]) if params[:id].present?
  end

  protected def user_params
    params.require(:user).permit(:name,
                                 :first_name,
                                 :last_name,
                                 :password,
                                 :password_digest,
                                 :classcode,
                                 :active,
                                 :username,
                                 :token,
                                 :ip_address,
                                 :clever_id,
                                 :signed_up_with_google,
                                 :google_id,
                                 :flags,
                                 :title,
                                 :time_zone,
                                 :account_type)
  end

  protected def edit_page_variables
    # if teacher was the last user to reset the students password, we will show that password in the class manager to the teacher
    @teacher_created_student = @student.username.split('@').last == @classroom.code
    @teacher_can_edit_password = !(@student.clever_id || @student.signed_up_with_google)
    @teacher_can_see_password =  (@student.password_digest && @student.authenticate(@student.last_name))
    @sign_up_method = {
      "Clever User": @student.clever_id,
      "Google Sign On User": @student.signed_up_with_google,
      "Student Email": @student.email
    }
  end

end
