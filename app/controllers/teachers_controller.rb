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

  def current_user_json
    render json: current_user.to_json
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
