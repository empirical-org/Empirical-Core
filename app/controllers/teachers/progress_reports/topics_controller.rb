class Teachers::ProgressReports::TopicsController < ApplicationController
  before_action :authorize!
  layout 'scorebook'

  def index
    if request.xhr?
      topics = Topic.for_progress_report(current_user, params)
      filters = params
      filters[:topic_id] = topics.map {|t| t['topic_id'] }
      classrooms = Classroom.for_progress_report(current_user, filters)
      units = Unit.for_progress_report(current_user, filters)
      students = User.for_progress_report(current_user, filters)
      render json: {
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