class Teachers::StudentsController < ApplicationController
  #layout 'classroom_manager'
  layout 'scorebook'
  before_filter :teacher!
  before_filter :authorize!

  def create
    fix_full_name_in_first_name_field
    @student = @classroom.students.build(user_params)
    @student.generate_student
    @student.save!
    redirect_to teachers_classroom_students_path(@classroom)
  end

  def edit

  end

  def index

  end

  def reset_password
    puts 'reset_password called'
    @student.generate_password
    @student.save!
    redirect_to edit_teachers_classroom_student_path(@classroom, @student)
  end

  def update
    if @student.update_attributes(user_params)
      #head :ok
      redirect_to edit_teachers_classroom_student_path(@classroom, @student)
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

  def fix_full_name_in_first_name_field
    if user_params[:last_name].blank? && (f,l = user_params[:first_name].split(/\s+/)).length > 1
      user_params[:first_name] = f
      user_params[:last_name] = l
    end
  end

  def user_params
    params.require(:user).permit!
  end
end
