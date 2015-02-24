class Teachers::ProgressReports::SectionsController < ApplicationController
  before_action :authorize!
  layout 'scorebook'

  def index
    if request.xhr?
      section_data = Section.for_progress_report(current_user, params)
      section_data.each do |section|
        section['section_link'] = teachers_progress_reports_section_topics_path(section['id'])
      end
      filters = params
      filters[:section_id] = section_data.map {|s| s['id']}
      classrooms = Classroom.for_progress_report(current_user, filters)
      units = Unit.for_progress_report(current_user, filters)
      students = User.for_progress_report(current_user, filters)
      render json: {
        sections: section_data,
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