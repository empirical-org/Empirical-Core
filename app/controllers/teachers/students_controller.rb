class Teachers::StudentsController < ApplicationController
  #layout 'classroom_manager'
  layout 'scorebook'
  before_filter :teacher!
  before_filter :authorize!

  def create
    #fix_full_name_in_first_name_field
    
    
    if user_params[:first_name].blank? or user_params[:last_name].blank?
      flash[:notice] = 'Please provide both a first name and a last name.'
      redirect_to teachers_classroom_invite_students_path(@classroom)
    elsif do_names_contain_spaces
      flash[:notice] = 'Names cannot contain spaces.'
      redirect_to teachers_classroom_invite_students_path(@classroom)
    else
      capitalize_first_and_last_name
      @student = @classroom.students.build(user_params)
      @student.generate_student
      @student.save!
      StudentCreationWorker.perform_async(current_user.id, @student.id)
      redirect_to teachers_classroom_invite_students_path(@classroom)
    end
  end

  def edit

  end

  def index

  end

  def reset_password
    @student.generate_password
    @student.save!
    redirect_to edit_teachers_classroom_student_path(@classroom, @student)
  end

  def update
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

  def do_names_contain_spaces
    a = user_params[:first_name].index(/\s/)
    b = user_params[:last_name].index(/\s/)
    !(a.nil? and b.nil?)
  end

  def capitalize_first_and_last_name 
    # make sure this is called after fix_full_name_in_first_name_field
    user_params[:first_name].capitalize!
    user_params[:last_name].capitalize!
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
