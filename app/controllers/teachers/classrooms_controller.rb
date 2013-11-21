class Teachers::ClassroomsController < ApplicationController
  before_filter :teacher!
  before_filter :authorize!

  def index
    if current_user.classrooms.any?
      redirect_to teachers_classroom_path(current_user.classrooms.first)
    end
  end

  def show
    @classroom_chapters = @classroom.chapters
    @classroom_students = @classroom.students.order(:name)
    @chapter_levels = ChapterLevel.all.map{ |level| [level, level.chapters - @classroom_chapters] }.select{ |group| group.second.any? }

    @score_table = Score.joins(:classroom_chapter).where(classroom_chapters: { classroom_id: @classroom.id }).inject({}) do |table, score|
      table[score.user_id] ||= {}
      table[score.user_id][score.classroom_chapter.chapter_id] = score

      table
    end
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
