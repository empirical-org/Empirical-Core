class Teachers::ProgressReports::ConceptTagsController < ApplicationController
  before_action :authorize!
  layout 'scorebook'

  def index
    if request.xhr?
      concept_tags = ConceptTag.for_progress_report(current_user, params)
      concept_category = ConceptCategory.for_tags_report(current_user, params[:concept_category_id])
      units = Unit.for_progress_report(current_user, params)
      students = User.for_progress_report(current_user, params)
      classrooms = Classroom.for_progress_report(current_user, params)
      render json: {
        concept_category: concept_category,
        concept_tags: concept_tags,
        units: units,
        students: students,
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