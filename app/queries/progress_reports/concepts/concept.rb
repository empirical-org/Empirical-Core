class ProgressReports::Concepts::Concept
  def self.results(teacher, filters)
    # Include:
    # name of the concept
    # correct results count
    # incorrect results count
    # total results count
    ::Concept.with(filtered_correct_results: ::ProgressReports::Concepts::ConceptResult.results(teacher, filters))
      .select(<<-SELECT
        concepts.id as concept_id,
        concepts.name as concept_name,
        COUNT(filtered_correct_results.*) as total_result_count,
        SUM(CASE WHEN filtered_correct_results.is_correct = 1 THEN 1 ELSE 0 END) as correct_result_count,
        SUM(CASE WHEN filtered_correct_results.is_correct = 0 THEN 1 ELSE 0 END) as incorrect_result_count,
        gp_concepts.name as level_2_concept_name
      SELECT
      ).joins('JOIN filtered_correct_results ON concepts.id = filtered_correct_results.concept_id')
      .joins('LEFT JOIN concepts as parent_concepts ON parent_concepts.id = concepts.parent_id')
      .joins('LEFT JOIN concepts as gp_concepts ON gp_concepts.id = parent_concepts.parent_id')
      .group("concepts.id, gp_concepts.name")
      .order("concepts.name asc")
  end
end
