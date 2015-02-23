class Teachers::ProgressReports::SectionsController < ApplicationController
  before_action :authorize!
  layout 'scorebook'

  def index
    if request.xhr?
      section_data = Section.for_progress_report(current_user)        
      render json: section_data
    end
  end

  private

  def authorize!
    return if current_user.try(:teacher?)
    render nothing: true, status: :unauthorized
  end
end