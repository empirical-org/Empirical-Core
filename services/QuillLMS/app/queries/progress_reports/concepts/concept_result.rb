# frozen_string_literal: true

class ProgressReports::Concepts::ConceptResult

  def self.results(teacher, filters)
    query = ::OldConceptResult.select(<<-SELECT
      cast(old_concept_results.metadata->>'correct' as int) as is_correct,
      activity_sessions.user_id,
      old_concept_results.concept_id
    SELECT
  ).joins({activity_session: {classroom_unit: :classroom}})
     .joins("INNER JOIN classrooms_teachers ON classrooms.id = classrooms_teachers.classroom_id")
      .where("activity_sessions.state = ? AND classrooms_teachers.user_id = ?", "finished", teacher.id)

    if filters[:classroom_id].present?
      query = query.where("classrooms.id = ?", filters[:classroom_id])
    end

    if filters[:student_id].present?
      query = query.where("activity_sessions.user_id = ?", filters[:student_id])
    end

    if filters[:unit_id].present?
      query = query.where("classroom_units.unit_id = ?", filters[:unit_id])
    end

    if filters[:concept_id].present?
      query = query.where("concept_results.concept_id = ?", filters[:concept_id])
    end

    query
  end
  # # Used as a CTE (common table expression) by other models to get progress report data.
  # def self.correct_results_for_progress_report(teacher, filters)

  # end

  # def self.grammar_counts
  #   select("concept_tags.name, #{correct_result_count_sql} as correct_result_count, #{incorrect_result_count_sql}  as incorrect_result_count")
  #   .joins(concept_tag: :concept_class)
  #   .where(concept_classes: {name: "Grammar Concepts"})
  #   .group("concept_tags.name")
  #   .order("concept_tags.name asc")
  #   .having("#{correct_result_count_sql} > 0 or #{incorrect_result_count_sql} > 0")
  # end

  # def self.correct_result_count_sql
  #   "SUM(CASE WHEN cast(concept_tag_results.metadata->>'correct' as int) = 1 THEN 1 ELSE 0 END)"
  # end

  # def self.incorrect_result_count_sql
  #   "SUM(CASE WHEN cast(concept_tag_results.metadata->>'correct' as int) = 0 THEN 1 ELSE 0 END)"
  # end

  # def self.total_result_count_sql
  #   "DISTINCT(COUNT(concept_tag_results.id)) as total_result_count"
  # end

end
