class TeacherFixController < ApplicationController
  before_filter :staff!

  def index
  end

end
