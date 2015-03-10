class Teachers::ProgressReports::ConceptTagsController < ApplicationController
  before_action :authorize!
  layout 'scorebook'

  def index
    if request.xhr?
      concept_tags = ConceptTag.for_progress_report(current_user, params)
      concept_tags.each do |concept_tag|
        concept_tag['students_href'] = teachers_progress_reports_concept_category_concept_tag_students_path(
            concept_category_id: params[:concept_category_id],
            concept_tag_id: concept_tag['concept_tag_id']
        )
      end
      concept_category = ConceptCategory.for_tags_report(current_user, params[:concept_category_id])
      units = Unit.for_progress_report(current_user, params)
      students = User.for_concept_tag_progress_report(current_user, params)
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