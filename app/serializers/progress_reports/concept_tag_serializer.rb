class ProgressReports::ConceptTagSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers

  # Ugh, crazy hack to get the concept_category_id into the params.
  attr_accessor :concept_category_id

  attributes :concept_tag_id,
    :concept_tag_name,
    :total_result_count,
    :correct_result_count,
    :incorrect_result_count,
    :students_href

  def students_href
    teachers_progress_reports_concept_category_concept_tag_students_path(
      concept_category_id: concept_category_id,
      concept_tag_id: object.concept_tag_id
    )
  end
end