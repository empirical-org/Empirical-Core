class Teachers::ClassroomManagerController < ApplicationController
  layout 'classroom_manager'
  before_filter :teacher!
  before_filter :authorize!
  layout 'scorebook'

  def scorebook

    @unit =  params[:unit_id].present? ? @classroom.units.find(params[:unit_id]) : @classroom.units.first
    @topic = params[:topic_id].present? ? @unit.topics.find(params[:topic_id]) : @unit.topics.first

    @classroom_activities = @topic.blank? ? [] : @unit.classroom_activities.with_topic(@topic.id)

    @score_table = @classroom.students.inject({}) {|memo, i| memo[i.id] = {name: i.name, activities: []}; memo  }

    @classroom_activities.each do |classroom_activity|
      scores = classroom_activity.scorebook

      scores.each { |student, data| @score_table[student][:activities] << data}
    end

    @score_table = @score_table.sort {|a, b| a.last[:name] <=> b.last[:name]}.collect(&:last)
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

    @workbook_table = @workbook_table.sort {|a, b| a.first <=> b.first}.collect(&:last)
    tutorial = @workbook_table.find {|a| a.keys.first == 'Quill Tutorial Lesson'}
    @workbook_table.delete(tutorial)
    @workbook_table = @workbook_table.unshift(tutorial)
  end


  private

  def authorize!
    @classroom = Classroom.find(params[:classroom_id])
    auth_failed unless @classroom.teacher == current_user
  end
end
