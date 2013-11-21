class Teachers::ClassroomsController < ApplicationController
  before_filter :teacher!
  before_filter :authorize!

  def index
    if current_user.classrooms.any?
      redirect_to teachers_classroom_path(current_user.classrooms.first)
    end
  end

  def show
    @students = @classroom.students
    @chapters = @classroom.chapters
    @other_chapters = Chapter.all - @chapters
  end

  def create
    @classroom = Classroom.create(classroom_params.merge(teacher: current_user))
    redirect_to [:teachers, @classroom]
  end

  def update
    @classroom.update_attributes(classroom_params)
    redirect_to [:teachers, @classroom]
  end

private

  def classroom_params
    params[:classroom].permit(:name, :code)
  end

  def authorize!
    return unless params[:id].present?
    @classroom = Classroom.find(params[:id])
    auth_failed unless @classroom.teacher == current_user
  end
end
