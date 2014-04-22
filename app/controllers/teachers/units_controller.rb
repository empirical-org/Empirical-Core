class Teachers::UnitsController < ApplicationController
  before_action :setup

  def create
    @classroom.units.create_next
    redirect_to teachers_classroom_lesson_planner_path(@classroom)
  end

protected

  def setup
    @classroom = current_user.classrooms.find(params[:classroom_id])
  end
end
