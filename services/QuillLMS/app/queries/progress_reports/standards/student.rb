class ProgressReports::Standards::Student
  def initialize(teacher)
    @teacher = teacher
    @proficiency_cutoff = ProficiencyEvaluator.proficiency_cutoff
  end

  def results(filters)
    best_activity_sessions_query = ProgressReports::Standards::ActivitySession.new(@teacher).results(filters).to_sql
    @best_activity_sessions = "( #{best_activity_sessions_query} ) AS best_activity_sessions"

    User
      .select(
        <<-SQL
          users.id,
          users.name,
          #{User.sorting_name_sql},
          AVG(best_activity_sessions.percentage) AS average_score,
          COUNT(DISTINCT(best_activity_sessions.standard_id)) AS total_standard_count,
          COUNT(DISTINCT(best_activity_sessions.activity_id)) AS total_activity_count,
          COALESCE(AVG(proficient_count.standard_count), 0)::integer AS proficient_standard_count,
          COALESCE(AVG(not_proficient_count.standard_count), 0)::integer AS not_proficient_standard_count
        SQL
      )
      .joins("JOIN #{@best_activity_sessions} ON users.id = best_activity_sessions.user_id")
      .joins("LEFT JOIN #{proficient_count} ON proficient_count.user_id = users.id")
      .joins("LEFT JOIN #{not_proficient_count} ON not_proficient_count.user_id = users.id")
      .group('users.id, sorting_name')
      .order('sorting_name ASC')
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
end
