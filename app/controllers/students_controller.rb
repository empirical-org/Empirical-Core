class StudentsController < ApplicationController

  def index
    @current_user = current_user
    @js_file = 'student'
  end

  def account_settings
    @current_user = current_user
    @js_file = 'student'
  end

  def student_demo
    @user = User.find_by_email 'maya_angelou_demo@quill.org'
    if @user.nil?
      Demo::ReportDemoDestroyer.destroy_demo(nil)
      Demo::ReportDemoCreator.create_demo(nil)
      redirect_to "/student_demo"
    else
      sign_in @user
      redirect_to '/profile'
    end
  end

  def make_teacher
    params[:role] = 'teacher' unless params[:role] == 'student'
    if current_user.update(role: params[:role], email: params[:email])
      render json: {status: 200}
    else
      render json: {errors: 'Please enter a valid email address.'}, status: 422
    end
  end

end
