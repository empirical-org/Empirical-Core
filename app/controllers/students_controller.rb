class StudentsController < ApplicationController

  def account_settings
    @current_user = current_user
    @js_file = 'student'
  end

  def make_teacher
    if current_user.update(role: 'teacher', email: params[:email])
      render json: {status: 200}
    else
      render json: {errors: 'Please enter a valid email address.'}, status: 422
    end
  end

end
