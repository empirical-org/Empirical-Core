class Teachers::ClassroomManagerController < ApplicationController
  layout 'classroom_manager'
  before_filter :teacher!
  before_filter :authorize!

  def old_scorebook
    @classroom_chapters = @classroom.chapters
    @classroom_students = @classroom.students.order(:name)
    @chapter_levels = ChapterLevel.all.map{ |level| [level, level.chapters - @classroom_chapters] }.select{ |group| group.second.any? }
  end

  def scorebook
    @unit = @classroom.units.find_by_id(params[:unit_id]) || @classroom.units.first
    @topic = @unit.topics.find_by_id(params[:topic_id])  || @unit.topics.first

    if @unit.topics.any?
      @score_table = ActivitySession.joins(:unit).joins(:activity).where(classroom_activities: { id: @unit.id }, activities: {topic_id: @topic.id}).inject({}) do |table, score|
        table[score.user_id] ||= {}
        table[score.user_id][score.classroom_activity.activity_id] = score

        table
      end
    end

    render 'new_scorebook'
  end

  def lesson_planner
    @workbook_table = {}

    (Activity.all - @classroom.activities).each do |activity|
      @workbook_table[activity.topic.section.position] ||= {}
      @workbook_table[activity.topic.section.position][activity.topic.section.name] ||= {}
      @workbook_table[activity.topic.section.position][activity.topic.section.name][activity.topic.name] ||= []
      @workbook_table[activity.topic.section.position][activity.topic.section.name][activity.topic.name] << activity
    end

    @workbook_table = @workbook_table.map.to_a.sort{|a,b| a.first <=> b.first}.map(&:last).map(&:to_a).map(&:first)
  end

protected

  # TODO: this is copied from Teachers::ClassroomsController#authorize!
  #       consider absracting using inheritance e.g. Teachers::BaseClassroomController
  def authorize!
    @classroom = Classroom.find(params[:classroom_id])
    auth_failed unless @classroom.teacher == current_user
  end
end
