class Teachers::ClassroomManagerController < ApplicationController
  layout 'classroom_manager'
  before_filter :teacher!
  before_filter :authorize!

  def scorebook
    @unit = @classroom.units.find_by_id(params[:unit_id]) || @classroom.units.first
    @topic = @unit.topics.find_by_id(params[:topic_id]) || @unit.topics.first

    @classroom_activities = if @topic.blank?
      []
    else
      @unit.classroom_activities.joins(:topic).where(topics: {id: @topic.id})
    end

    @classroom_activities = @classroom_activities.to_a
    students = @classroom.students.to_a

    if @unit && @unit.topics.any?
      @score_table = {}
      students.map(&:name).each{|n| @score_table[n] = {}}

      @classroom_activities.each do |classroom_activity|
        sessions = classroom_activity.activity_sessions.order('activity_sessions.id asc')
        sessions.each do |activity_session|
          student = activity_session.user
          next unless student.student?

          if @score_table[student.name][classroom_activity.activity].present? && !activity_session.completed?
            next
          end

          @score_table[student.name][classroom_activity.activity] ||= { session: activity_session }
        end
      end
    end
  end

  def lesson_planner
    @workbook_table = {}
    @classroom_table = {}

    (@classroom.activities.production).each do |activity|
      @workbook_table[activity.topic.section.position] ||= {}
      @workbook_table[activity.topic.section.position][activity.topic.section.name] ||= {}
      @workbook_table[activity.topic.section.position][activity.topic.section.name][activity.topic.name] ||= []
      @workbook_table[activity.topic.section.position][activity.topic.section.name][activity.topic.name] << activity
    end

    (Activity.production - @classroom.activities.production).each do |activity|
      @workbook_table[activity.topic.section.position] ||= {}
      @workbook_table[activity.topic.section.position][activity.topic.section.name] ||= {}
      @workbook_table[activity.topic.section.position][activity.topic.section.name][activity.topic.name] ||= []
      @workbook_table[activity.topic.section.position][activity.topic.section.name][activity.topic.name] << activity
    end

    # @workbook_table = @workbook_table.map.to_a.sort{|a,b| a.first <=> b.first}.map(&:last).map(&:to_a).map(&:first)
    # binding.pry
  end

protected

  # TODO: this is copied from Teachers::ClassroomsController#authorize!
  #       consider absracting using inheritance e.g. Teachers::BaseClassroomController
  def authorize!
    @classroom = Classroom.find(params[:classroom_id])
    auth_failed unless @classroom.teacher == current_user
  end
end
