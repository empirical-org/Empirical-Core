# frozen_string_literal: true

class ProgressReports::Standards::AllClassroomsStandard
  PROFICIENT_THRESHOLD = 0.8

  def initialize(teacher)
    @teacher = teacher
  end

  def results(classroom_id, student_id)
    RawSqlRunner.execute(
      <<-SQL
        WITH final_activity_sessions AS (
          SELECT
            activity_sessions.activity_id,
            activity_sessions.id,
            activity_sessions.percentage,
            activity_sessions.timespent,
            activity_sessions.user_id,
            activities.standard_id
          FROM activity_sessions
          JOIN classroom_units
            ON activity_sessions.classroom_unit_id = classroom_units.id
          JOIN activities
            ON activity_sessions.activity_id = activities.id
          LEFT JOIN standards
            ON standards.id = activities.standard_id
          #{classroom_joins(classroom_id)}
          WHERE activity_sessions.is_final_score
            #{student_condition(student_id)}
            #{classroom_condition(classroom_id)}
            AND activity_sessions.visible
            AND classroom_units.visible
        )

        SELECT
          standards.id,
          standards.name,
          standard_levels.name AS standard_level_name,
          COUNT(DISTINCT(final_activity_sessions.activity_id)) AS total_activity_count,
          COUNT(DISTINCT(final_activity_sessions.user_id)) AS total_student_count,
          COUNT(DISTINCT(avg_score_for_standard_by_user.user_id)) AS proficient_count,
          SUM(final_activity_sessions.timespent) AS timespent,
          (CASE WHEN standards.standard_category_id = #{::Constants::EVIDENCE_STANDARD_CATEGORY} THEN true ELSE false END) AS is_evidence

        FROM standards
        JOIN standard_levels
          ON standard_levels.id = standards.standard_level_id
        JOIN final_activity_sessions
          ON final_activity_sessions.standard_id = standards.id
        LEFT JOIN (
          SELECT
            standard_id,
            user_id,
            AVG(percentage) AS avg_score
          FROM final_activity_sessions
          GROUP BY
            final_activity_sessions.standard_id,
            final_activity_sessions.user_id
          HAVING AVG(percentage) >= #{PROFICIENT_THRESHOLD}
        ) AS avg_score_for_standard_by_user
          ON avg_score_for_standard_by_user.standard_id = standards.id
        GROUP BY
          standards.id,
          standard_levels.name
        ORDER BY standards.name ASC
      SQL
    ).to_a
  end

  def classroom_joins(classroom_id)
    return if classroom_id

    "JOIN classrooms ON classroom_units.classroom_id = classrooms.id JOIN classrooms_teachers ON classrooms.id = classrooms_teachers.classroom_id AND classrooms_teachers.user_id = #{@teacher.id} AND classrooms.visible = true"
  end

  def classroom_condition(classroom_id)
    return unless classroom_id

    "AND classroom_units.classroom_id = #{classroom_id}"
  end

  def student_condition(student_id)
    return unless student_id

    "AND activity_sessions.user_id = #{student_id}"
  end
end
