class TeachersController < ApplicationController
  before_action :set_admin_account, only: [:create]

  def create
    x = teacher_params.merge({password: teacher_params[:last_name]})
    @teacher = @admin_account.teachers.create(x)
    if @teacher.errors.empty?
      render json: Admin::TeacherSerializer.new(@teacher, root: false)
    else
      render json: @teacher.errors, status: 422
    end
  end

  def admin_dashboard
    if current_user.admin?
      render 'admin'
    else
      redirect_to profile_path
    end
  end

  def current_user_json
    render json: current_user.to_json
  end

  def classrooms_i_teach_with_students
    render json: {classrooms: current_user.classrooms_i_teach_with_students}
  end

  def classrooms_i_teach_with_lessons
    lesson_activity_ids = Activity.where(activity_classification_id: 6).map(&:id)
    classrooms = current_user.classrooms_i_teach.includes(classroom_activities: [{activity: :classification}]).where(classroom_activities: {activity_id: lesson_activity_ids})
    render json: {classrooms: classrooms}
  end

  def update_current_user
    if current_user.update(teacher_params)
      render json: current_user
    else
      render json: {errors: current_user.errors}, status: 400
    end
  end

  def get_completed_diagnostic_unit_info
    if current_user.milestones.where(name: 'Complete Diagnostic')
      unit_ids = current_user.finished_diagnostic_unit_ids
      if unit_ids.length > 0
        unit_id = unit_ids.first.id
        ca = ClassroomActivity.find_by(unit_id: unit_id, activity_id: [413, 447])
        unit_info = { unit_id: unit_id, classroom_id: ca.classroom_id, activity_id: ca.activity_id }
      else
        unit_info = nil
      end
    else
      unit_info = nil
    end
    render json: {unit_info: unit_info}
  end

  private

  def set_admin_account
    # TODO: when admins actually belong to more than 1 admin_account,
    # we will need to specifically fetch an admin_account by id
    @admin_account = User.find(params[:admin_id]).admin_accounts.first
  end

  def teacher_params
    params.require(:teacher).permit(:admin_id, :first_name, :last_name, :email)
           .merge({role: 'teacher'})

  end

end
