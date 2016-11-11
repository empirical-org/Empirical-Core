class StudentsController < ApplicationController

  def account_settings
    @current_user = current_user
  end

  def make_teacher
    current_user.update(role: 'teacher')
    render json: {status: 'success'}.to_json
  end

end
