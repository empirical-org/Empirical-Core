class Teachers::ClassroomManagerController < ApplicationController
  layout 'classroom_manager'
  before_filter :teacher!
  before_filter :authorize!
  before_filter :setup

  def old_scorebook
    @classroom_chapters = @classroom.chapters
    @classroom_students = @classroom.students.order(:name)
    @chapter_levels = ChapterLevel.all.map{ |level| [level, level.chapters - @classroom_chapters] }.select{ |group| group.second.any? }

    @score_table = Score.joins(:classroom_chapter).where(classroom_chapters: { classroom_id: @classroom.id }).inject({}) do |table, score|
      table[score.user_id] ||= {}
      table[score.user_id][score.classroom_chapter.chapter_id] = score

      table
    end
  end

  def scorebook
    render 'new_scorebook'
  end

  def lesson_planner
    @workbook_table = {}

    (Activity.all - @classroom.activities).each do |activity|
      @workbook_table[activity.topic.section.name] ||= {}
      @workbook_table[activity.topic.section.name][activity.topic.name] ||= []
      @workbook_table[activity.topic.section.name][activity.topic.name] << activity
    end
  end

protected
  def setup
  end

  # TODO: this is copied from Teachers::ClassroomsController#authorize!
  #       consider absracting using inheritance e.g. Teachers::BaseClassroomController
  def authorize!
    @classroom = Classroom.find(params[:classroom_id])
    auth_failed unless @classroom.teacher == current_user
  end
end
