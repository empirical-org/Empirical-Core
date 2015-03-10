class ProgressReports::ConceptCategorySerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers

  attributes :concept_category_id,
    :concept_category_name,
    :total_result_count,
    :correct_result_count,
    :incorrect_result_count,
    :concept_tag_href

  def concept_tag_href
    teachers_progress_reports_concept_category_concept_tags_path(object.concept_category_id)
  end
end