class Teachers::ProgressReports::ConceptCategoriesController < ApplicationController
  before_action :authorize!
  layout 'scorebook'

  def index
    if request.xhr?
      concept_categories = ConceptCategory.for_progress_report(current_user)
      concept_categories.each do |concept_category|
        concept_category['concept_tag_href'] =
          teachers_progress_reports_concept_category_concept_tags_path(concept_category_id: concept_category['concept_category_id'])
      end

      render json: {
        concept_categories: concept_categories
      }
    end
  end

  private

  def authorize!
    return if current_user.try(:teacher?)
    render nothing: true, status: :unauthorized
  end
end