class ProgressReports::Concepts::Concept
  def self.results(teacher, filters)
    filtered_correct_results_query = ::ProgressReports::Concepts::ConceptResult.results(teacher, filters).to_sql
    filtered_correct_results = "( #{filtered_correct_results_query} ) AS filtered_correct_results"

    ::Concept
      .select(
        <<-SQL
          concepts.id AS concept_id,
          concepts.name AS concept_name,
          COUNT(filtered_correct_results.*) AS total_result_count,
          SUM(CASE WHEN filtered_correct_results.is_correct = 1 THEN 1 ELSE 0 END) AS correct_result_count,
          SUM(CASE WHEN filtered_correct_results.is_correct = 0 THEN 1 ELSE 0 END) AS incorrect_result_count,
          gp_concepts.name AS level_2_concept_name
        SQL
      )
      .joins("JOIN #{filtered_correct_results} ON concepts.id = filtered_correct_results.concept_id")
      .joins('LEFT JOIN concepts AS parent_concepts ON parent_concepts.id = concepts.parent_id')
      .joins('LEFT JOIN concepts AS gp_concepts ON gp_concepts.id = parent_concepts.parent_id')
      .group("concepts.id, gp_concepts.name")
      .order("concepts.name asc")
  end
end
