class ConceptCategory < ActiveRecord::Base
  belongs_to :concept_class

  has_many :concept_tag_results

  def self.for_progress_report(teacher, filters)
    with(filtered_correct_results: ConceptTagResult.correct_results_for_progress_report(teacher, filters))
      .select(<<-SELECT
        concept_categories.id as concept_category_id,
        concept_categories.name as concept_category_name,
        COUNT(filtered_correct_results.*) as total_result_count,
        SUM(CASE WHEN filtered_correct_results.is_correct = 1 THEN 1 ELSE 0 END) as correct_result_count,
        SUM(CASE WHEN filtered_correct_results.is_correct = 0 THEN 1 ELSE 0 END) as incorrect_result_count
      SELECT
      ).joins('JOIN filtered_correct_results ON concept_categories.id = filtered_correct_results.concept_category_id')
      .group("concept_categories.id")
      .order("concept_categories.name asc")
  end
end