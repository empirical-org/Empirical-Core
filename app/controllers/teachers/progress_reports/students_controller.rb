class Teachers::ProgressReports::StudentsController < ApplicationController
  before_action :authorize!
  layout 'scorebook'

  def index
    if request.xhr?
      students = User.for_concept_tag_progress_report(current_user, params)
      concept_tag = ConceptTag.for_progress_report(current_user, params).first
      # concept_category = ConceptCategory.for_tags_report(current_user, params[:concept_category_id])
      units = Unit.for_progress_report(current_user, params)
      # students = User.for_progress_report(current_user, params)
      classrooms = Classroom.for_progress_report(current_user, params)
      render json: {
        concept_tag: concept_tag,
        students: students,
        units: units,
        classrooms: classrooms
      }
    end
  end

  private

  def authorize!
    return if current_user.try(:teacher?)
    render nothing: true, status: :unauthorized
  end
end