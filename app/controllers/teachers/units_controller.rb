class Teachers::UnitsController < ApplicationController
  #before_action :setup



  def create
	puts ''
    puts ''
    puts ''
    puts 'zinga'
    puts 'in create unit'
    puts 'params are : '
    puts params.to_json

    redirect_to teachers_classroom_scorebook_path(current_user.classrooms.first)


  end








  # def create
  #   @classroom.units.create_next
  #   redirect_to teachers_classroom_lesson_planner_path(@classroom)
  # end

# protected

#   def setup
#     @classroom = current_user.classrooms.find(params[:classroom_id])
#   end
end
