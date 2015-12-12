class GradesController < ApplicationController
  def index
    render json: Classroom::GRADES
  end
end
