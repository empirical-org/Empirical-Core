class Teachers::ProgressReports::ConceptCategoriesController < ApplicationController
  before_action :authorize!
  layout 'scorebook'

  def index
    if request.xhr?
      filters = params
      concept_categories = ConceptCategory.for_progress_report(current_user, filters)
      categories_json = concept_categories.map do |category|
        ::ProgressReports::ConceptCategorySerializer.new(category).as_json(root: false)
      end

      filters[:concept_category_id] = concept_categories.map {|c| c['concept_category_id']}
      units = Unit.for_standards_progress_report(current_user, filters)
      students = User.for_concept_tag_progress_report(current_user, filters)
      classrooms = Classroom.for_standards_progress_report(current_user, filters)
      render json: {
        concept_categories: categories_json,
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