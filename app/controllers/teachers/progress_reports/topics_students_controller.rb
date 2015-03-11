class Teachers::ProgressReports::TopicsStudentsController < ApplicationController
  before_action :authorize!
  layout 'scorebook'

  def index
    if request.xhr?
      render json: json_payload
    else
      @section = Section.find(params[:section_id])
      @topic = Topic.find(params[:topic_id])
    end
  end

  private

  def json_payload
    {
      students: User.for_standards_progress_report(current_user, params),
      classrooms: Classroom.for_standards_progress_report(current_user, params),
      units: Unit.for_standards_progress_report(current_user, params),
      topic: Topic.for_progress_report(current_user, params).first
    }
  end

  def authorize!
    return if current_user.try(:teacher?)
    render nothing: true, status: :unauthorized
  end
end