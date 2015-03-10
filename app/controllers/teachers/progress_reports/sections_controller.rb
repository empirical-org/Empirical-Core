class Teachers::ProgressReports::SectionsController < ApplicationController
  before_action :authorize!
  layout 'scorebook'

  def index
    if request.xhr?
      sections = Section.for_progress_report(current_user, params)
      section_json = sections.map do |section|
        ::ProgressReports::SectionSerializer.new(section).as_json(root: false)
      end
      filters = params
      filters[:section_id] = sections.map {|s| s.id}
      units = Unit.for_standards_progress_report(current_user, filters)
      students = User.for_standards_progress_report(current_user, filters)
      classrooms = Classroom.for_progress_report(current_user, filters)
      render json: {
        sections: section_json,
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