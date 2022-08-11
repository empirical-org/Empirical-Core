# frozen_string_literal: true

class ProgressReports::Concepts::ConceptResult

  def self.results(teacher, filters)
    query = ::ConceptResult.select(<<-SELECT
      cast(concept_results.correct as int) as is_correct,
      activity_sessions.user_id,
      concept_results.concept_id
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
end
