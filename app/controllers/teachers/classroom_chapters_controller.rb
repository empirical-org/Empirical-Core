class Teachers::ClassroomChaptersController < ApplicationController
  before_filter :teacher!
  before_filter :authorize!

  def show
    @classroom_chapter.due_date ||= Time.now
  end

  def update
    @classroom_chapter.attributes = classroom_chapter_params
    @classroom_chapter.save
    redirect_to [:teachers, @classroom]
  end

  def destroy
    @classroom_chapter.destroy
    redirect_to [:teachers, @classroom]
  end

private

  def authorize!
    @classroom = Classroom.where(teacher_id: current_user.id).find(params[:classroom_id])
    @chapter = Chapter.find(params[:id])
    @classroom_chapter = @classroom.classroom_chapters.find_or_initialize_by(chapter_id: @chapter.id)
  end

  def classroom_chapter_params
    params[:classroom_chapter].permit(:due_date, :due_date_string)
  end
end
