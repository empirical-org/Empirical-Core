class Teachers::ProgressReports::ConceptCategoriesController < ApplicationController
  before_action :authorize!
  layout 'scorebook'

  def index
    if request.xhr?
      filters = params
      concept_categories = ConceptCategory.for_progress_report(current_user, filters)
      concept_categories.each do |concept_category|
        concept_category['concept_tag_href'] =
          teachers_progress_reports_concept_category_concept_tags_path(concept_category_id: concept_category['concept_category_id'])
      end

      filters[:concept_category_id] = concept_categories.map {|c| c['concept_category_id']}
      units = Unit.for_progress_report(current_user, filters)
      students = User.for_concept_tag_progress_report(current_user, filters)
      classrooms = Classroom.for_progress_report(current_user, filters)
      render json: {
        concept_categories: concept_categories,
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