# frozen_string_literal: true

class ProgressReports::Standards::NewStudent
  def initialize(teacher)
    @teacher = teacher
    @proficiency_cutoff = ProficiencyEvaluator.proficiency_cutoff
  end

  def results(filters)
    @standard_id = filters ? filters["standard_id"] : nil
    @classroom_id = filters ? filters["classroom_id"] : nil

    ::User
      .select(
        <<-SQL
          users.id,
          users.name,
          #{User.sorting_name_sql},
          AVG(best_activity_sessions.percentage) AS average_score,
          COUNT(DISTINCT(best_activity_sessions.standard_id)) AS total_standard_count,
          COUNT(DISTINCT(best_activity_sessions.activity_id)) AS total_activity_count,
          SUM(best_activity_sessions.timespent) AS timespent,
          COALESCE(AVG(proficient_count.standard_count), 0)::integer AS proficient_standard_count,
          COALESCE(AVG(not_proficient_count.standard_count), 0)::integer AS not_proficient_standard_count
        SQL
      )
      .joins("JOIN #{best_activity_sessions} ON users.id = best_activity_sessions.user_id")
      .joins("LEFT JOIN #{proficient_count} ON proficient_count.user_id = users.id")
      .joins("LEFT JOIN #{not_proficient_count} ON not_proficient_count.user_id = users.id")
      .group('users.id, sorting_name')
      .order('sorting_name asc')
  end

  private def best_activity_sessions
    <<-SQL
      (
        SELECT activity_sessions.*, activities.standard_id
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
          #{classroom_conditional}
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
          COUNT(DISTINCT(standard_id)) AS standard_count,
          user_id
        FROM #{best_per_standard_user}
        WHERE avg_score_in_standard >= #{@proficiency_cutoff}
        GROUP BY user_id
      ) AS proficient_count
    SQL
  end

  private def not_proficient_count
    <<-SQL
      (
        SELECT
          COUNT(DISTINCT(standard_id)) AS standard_count,
          user_id
        FROM #{best_per_standard_user}
        WHERE avg_score_in_standard < #{@proficiency_cutoff}
        GROUP BY user_id
      ) AS not_proficient_count
    SQL
  end

  private def standard_conditional
    "AND activities.standard_id = #{@standard_id}" if @standard_id
  end

  private def classroom_conditional
    return unless @classroom_id
    return if [0, '0'].include?(@classroom_id)

    "AND classrooms.id = #{@classroom_id}"
  end
end
