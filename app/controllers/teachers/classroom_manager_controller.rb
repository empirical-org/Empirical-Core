class Teachers::ClassroomManagerController < ApplicationController
  layout 'classroom_manager'
  before_filter :teacher!
  before_filter :authorize!
  layout 'scorebook'

  def scorebook
    @classrooms = current_user.classrooms - [@classroom]
    @unit = @classroom.units.find(params[:unit_id]) if params[:unit_id]
    @units = @classroom.units - [@unit]
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
      if !activity.topic.nil?
        @workbook_table[activity.topic.section.position] ||= {}
        @workbook_table[activity.topic.section.position][activity.topic.section.name] ||= {}
        @workbook_table[activity.topic.section.position][activity.topic.section.name][activity.topic.name] ||= []
        @workbook_table[activity.topic.section.position][activity.topic.section.name][activity.topic.name] << activity
      end
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
