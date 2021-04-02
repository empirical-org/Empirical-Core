class ProgressReports::Standards::Student
  def initialize(teacher)
    @teacher = teacher
    @proficiency_cutoff = ProficiencyEvaluator.proficiency_cutoff
  end

  def results(filters)
    best_activity_sessions = ProgressReports::Standards::ActivitySession.new(@teacher).results(filters)
    User.with(best_activity_sessions: best_activity_sessions)
      .with(best_per_standard_user: ProgressReports::Standards::Student.best_per_standard_user)
      .select(<<-SQL
        users.id,
        users.name,
        #{User.sorting_name_sql},
        AVG(best_activity_sessions.percentage) as average_score,
        COUNT(DISTINCT(best_activity_sessions.standard_id)) as total_standard_count,
        COUNT(DISTINCT(best_activity_sessions.activity_id)) as total_activity_count,
        COALESCE(AVG(proficient_count.standard_count), 0)::integer as proficient_standard_count,
        COALESCE(AVG(not_proficient_count.standard_count), 0)::integer as not_proficient_standard_count
      SQL
      ).joins('JOIN users ON users.id = best_activity_sessions.user_id')
      .joins("
      LEFT JOIN (
          select COUNT(DISTINCT(standard_id)) as standard_count, user_id
           from best_per_standard_user
           where avg_score_in_standard >= #{@proficiency_cutoff}
           group by user_id
        ) as proficient_count ON proficient_count.user_id = users.id"
      ).joins(<<-JOINS
      LEFT JOIN (
          select COUNT(DISTINCT(standard_id)) as standard_count, user_id
           from best_per_standard_user
           where avg_score_in_standard < #{@proficiency_cutoff}
           group by user_id
        ) as not_proficient_count ON not_proficient_count.user_id = users.id
      JOINS
      )
      .group('users.id, sorting_name')
      .order('sorting_name asc')
  end

  # Helper method used as CTE in other queries. Do not attempt to use this by itself
  def self.best_per_standard_user
    <<-BEST
      select standard_id, user_id, AVG(percentage) as avg_score_in_standard
      from best_activity_sessions
      group by standard_id, user_id
    BEST
  end
end
