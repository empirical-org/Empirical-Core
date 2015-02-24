class Teachers::ProgressReports::TopicsController < ApplicationController
  before_action :authorize!
  layout 'scorebook'

  def index
    if request.xhr?
      render json: {
        topics: Topic.all
        # classrooms: classrooms,
        # students: students,
        # units: units
      }
    end
  end

  private

  def authorize!
    return if current_user.try(:teacher?)
    render nothing: true, status: :unauthorized
  end
end