class Teachers::ProgressReports::TopicsController < ApplicationController
  before_action :authorize!
  layout 'scorebook'

  def index
    if request.xhr?
      section = Section.for_progress_report(current_user, params).first
      topics = Topic.for_progress_report(current_user, params)
      topics_json = topics.map do |topic|
        ::ProgressReports::TopicSerializer.new(topic).as_json(root: false)
      end
      filters = params
      filters[:topic_id] = topics.map {|t| t['topic_id'] }
      classrooms = Classroom.for_standards_progress_report(current_user, filters)
      units = Unit.for_standards_progress_report(current_user, filters)
      students = User.for_standards_progress_report(current_user, filters)
      render json: {
        section: section,
        topics: topics_json,
        classrooms: classrooms,
        students: students,
        units: units
      }
    else
      @section = Section.find(params[:section_id])
    end
  end

  private

  def authorize!
    return if current_user.try(:teacher?)
    render nothing: true, status: :unauthorized
  end
end