class Teachers::UnitsController < ApplicationController
  before_action :setup

  def create
    @classroom.units.create(name: "Unit #{@classroom.units.count + 1}")
    redirect_to teachers_classroom_lesson_planner_path(@classroom)
  end

protected

  def setup
    @classroom = current_user.classrooms.find(params[:classroom_id])
  end
end