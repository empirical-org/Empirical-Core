class Teachers::StudentsController < ApplicationController
  layout 'classroom_manager'
  before_filter :teacher!
  before_filter :authorize!

  def create
    @student = @classroom.students.build(user_params)
    @student.generate_student
    @student.save!
    redirect_to teachers_classroom_students_path(@classroom)
  end

  def edit

  end

  def reset_password
    @student.generate_password
    @student.save!
    redirect_to edit_teachers_classroom_student_path(@classroom, @student)
  end

  def update
    if @student.update_attributes(user_params)
      head :ok
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
