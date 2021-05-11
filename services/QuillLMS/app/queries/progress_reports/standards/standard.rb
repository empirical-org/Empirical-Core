class ProgressReports::Standards::Standard
  def initialize(teacher)
    @teacher = teacher
    @proficiency_cutoff = ProficiencyEvaluator.proficiency_cutoff
  end

  def results(filters)
    best_activity_sessions_query = ProgressReports::Standards::ActivitySession.new(@teacher).results(filters).to_sql
    @best_activity_sessions = "( #{best_activity_sessions_query} ) AS best_activity_sessions"

    ::Standard
      .select(
        <<-SQL
          standards.id,
          standards.name,
          standard_levels.name AS standard_level_name,
          AVG(best_activity_sessions.percentage) AS average_score,
          COUNT(DISTINCT(best_activity_sessions.activity_id)) AS total_activity_count,
          COUNT(DISTINCT(best_activity_sessions.user_id)) AS total_student_count,
          COALESCE(AVG(proficient_count.user_count), 0)::integer AS proficient_student_count,
          COALESCE(AVG(not_proficient_count.user_count), 0)::integer AS not_proficient_student_count
        SQL
      )
      .joins('JOIN standard_levels ON standard_levels.id = standards.standard_level_id')
      .joins("JOIN #{@best_activity_sessions} ON standards.id = best_activity_sessions.standard_id")
      .joins("LEFT JOIN #{not_proficient_count} ON not_proficient_count.standard_id = standards.id")
      .joins("LEFT JOIN #{proficient_count} ON proficient_count.standard_id = standards.id")
      .group('standards.id, standard_levels.name')
      .order('standards.name ASC')
  end

  private def best_per_standard_user
    <<-SQL
      (
        SELECT
          standard_id,
          user_id,
          AVG(percentage) AS avg_score_in_standard
        FROM #{@best_activity_sessions}
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
end

