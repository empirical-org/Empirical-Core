class ClassroomsTeachersController < ApplicationController
  before_action :signed_in!

  def edit_coteacher_form
    @classrooms_user_coteachers_with_a_specific_teacher = current_user.classrooms_i_coteach_with_a_specific_teacher(params[:coteacher_id])
    if @classrooms_user_coteachers_with_a_specific_teacher.any?
      @coteacher_name = User.find(params[:coteacher_id]).pluck(:name)
    end
  end


end
