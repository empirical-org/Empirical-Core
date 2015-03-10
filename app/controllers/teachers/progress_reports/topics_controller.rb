class Teachers::ProgressReports::TopicsController < ApplicationController
  before_action :authorize!
  layout 'scorebook'

  def index
    if request.xhr?
      section = Section.for_progress_report(current_user, params).limit(1).first
      topics = Topic.for_progress_report(current_user, params)
      filters = params
      filters[:topic_id] = topics.map {|t| t['topic_id'] }
      classrooms = Classroom.for_standards_progress_report(current_user, filters)
      units = Unit.for_standards_progress_report(current_user, filters)
      students = User.for_standards_progress_report(current_user, filters)
      render json: {
        section: section,
        topics: topics,
        classrooms: classrooms,
        students: students,
        units: units
      }
    end
  end

  private

  def authorize!
    return if current_user.try(:teacher?)
    render nothing: true, status: :unauthorized
  end
end