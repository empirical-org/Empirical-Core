# frozen_string_literal: true

class ProgressReports::Standards::NewStandard
  def initialize(teacher)
    @teacher = teacher
    @proficiency_cutoff = ProficiencyEvaluator.proficiency_cutoff
  end

  def results(filters)
    @standard_id = filters ? filters["standard_id"] : nil
    @student_id = filters ? filters["student_id"] : nil

    ::Standard
      .select(
        <<-SQL
          standards.id,
          standards.name,
          standard_levels.name AS standard_level_name,
          AVG(best_activity_sessions.percentage) AS average_score,
          COUNT(DISTINCT(best_activity_sessions.activity_id)) AS total_activity_count,
          COUNT(DISTINCT(best_activity_sessions.user_id)) AS total_student_count,
          SUM(best_activity_sessions.timespent) AS timespent,
          COALESCE(AVG(proficient_count.user_count), 0)::integer AS proficient_student_count,
          COALESCE(AVG(not_proficient_count.user_count), 0)::integer AS not_proficient_student_count,
          (CASE WHEN standards.standard_category_id = #{Constants::EVIDENCE_STANDARD_CATEGORY} THEN true ELSE false END) AS is_evidence
        SQL
      )
      .joins('JOIN standard_levels ON standard_levels.id = standards.standard_level_id')
      .joins("JOIN #{best_activity_sessions} ON standards.id = best_activity_sessions.standard_id")
      .joins("LEFT JOIN #{not_proficient_count} ON not_proficient_count.standard_id = standards.id")
      .joins("LEFT JOIN #{proficient_count} ON proficient_count.standard_id = standards.id")
      .group('standards.id, standard_levels.name')
      .order('standards.name asc')
  end

  private def best_activity_sessions
    <<-SQL
      (
        SELECT
          activity_sessions.*,
          activities.standard_id
        FROM activity_sessions
          JOIN classroom_units
            ON activity_sessions.classroom_unit_id = classroom_units.id
          JOIN activities
            ON activity_sessions.activity_id = activities.id
          JOIN classrooms
            ON classroom_units.classroom_id = classrooms.id
          JOIN classrooms_teachers
            ON classrooms.id = classrooms_teachers.classroom_id
            AND classrooms_teachers.user_id = #{@teacher.id}
        WHERE activity_sessions.is_final_score
          #{standard_conditional}
          #{student_conditional}
          AND activity_sessions.visible
          AND classroom_units.visible
      ) AS best_activity_sessions
    SQL
  end

  private def best_per_standard_user
    <<-SQL
      (
        SELECT
          standard_id,
          user_id,
          AVG(percentage) AS avg_score_in_standard
        FROM #{best_activity_sessions}
        GROUP By standard_id, user_id
      ) AS best_per_standard_user
    SQL
  end

  private def proficient_count
    <<-SQL
      (
        SELECT
          COUNT(DISTINCT(user_id)) AS user_count,
          standard_id
        FROM #{best_per_standard_user}
        WHERE avg_score_in_standard >= #{@proficiency_cutoff}
        GROUP BY standard_id
      ) AS proficient_count
    SQL
  end

  private def not_proficient_count
    <<-SQL
      (
        SELECT
          COUNT(DISTINCT(user_id)) AS user_count,
          standard_id
        FROM #{best_per_standard_user}
        WHERE avg_score_in_standard < #{@proficiency_cutoff}
        GROUP BY standard_id
      ) AS not_proficient_count
    SQL
  end


  private def standard_conditional
    "AND activities.standard_id = #{@standard_id}" if @standard_id
  end

  private def student_conditional
    "AND activity_sessions.user_id = #{@student_id}" if @student_id
  end
end
