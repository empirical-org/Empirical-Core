class Teachers::ProgressReports::TopicsStudentsController < ApplicationController
  before_action :authorize!
  layout 'scorebook'

  def index
    @section = Section.find(params[:section_id])
    @topic = Topic.for_progress_report(current_user, params).first

    if request.xhr?
      render json: json_payload
    end
  end

  private

  def json_payload
    {
      students: User.for_standards_progress_report(current_user, params),
      classrooms: Classroom.for_standards_progress_report(current_user, params),
      units: Unit.for_standards_progress_report(current_user, params),
      topic: @topic
    }
  end

  def authorize!
    return if current_user.try(:teacher?)
    render nothing: true, status: :unauthorized
  end
end