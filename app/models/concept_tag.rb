class ConceptTag < ActiveRecord::Base
  belongs_to :concept_class
  has_many :concept_tag_results

  def self.for_progress_report(teacher, filters)
    with(filtered_correct_results: ConceptTagResult.correct_results_for_progress_report(teacher, filters))
      .select(<<-SELECT
        concept_tags.id as concept_tag_id,
        concept_tags.name as concept_tag_name,
        COUNT(filtered_correct_results.*) as total_result_count,
        SUM(CASE WHEN filtered_correct_results.is_correct = 1 THEN 1 ELSE 0 END) as correct_result_count,
        SUM(CASE WHEN filtered_correct_results.is_correct = 0 THEN 1 ELSE 0 END) as incorrect_result_count
      SELECT
      ).joins('JOIN filtered_correct_results ON concept_tags.id = filtered_correct_results.concept_tag_id')
      .group("concept_tags.id")
      .order("concept_tags.name asc")
  end
end