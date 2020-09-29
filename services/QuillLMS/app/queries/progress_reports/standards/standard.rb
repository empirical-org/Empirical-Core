class ProgressReports::Standards::Standard
  def initialize(teacher)
    @teacher = teacher
    @proficiency_cutoff = ProficiencyEvaluator.proficiency_cutoff
  end

  def results(filters)
    best_activity_sessions = ProgressReports::Standards::ActivitySession.new(@teacher).results(filters)
    ::Standard.from_cte('best_activity_sessions', best_activity_sessions)
      .with(best_per_standard_user: ProgressReports::Standards::Student.best_per_standard_user)
      .select(<<-SQL
        standards.id,
        standards.name,
        standard_levels.name as standard_level_name,
        AVG(best_activity_sessions.percentage) as average_score,
        COUNT(DISTINCT(best_activity_sessions.activity_id)) as total_activity_count,
        COUNT(DISTINCT(best_activity_sessions.user_id)) as total_student_count,
        COALESCE(AVG(proficient_count.user_count), 0)::integer as proficient_student_count,
        COALESCE(AVG(not_proficient_count.user_count), 0)::integer as not_proficient_student_count
      SQL
    ).joins('JOIN standards ON standards.id = best_activity_sessions.standard_id')
      .joins('JOIN standard_levels ON standard_levels.id = standards.standard_level_id')
      .joins("LEFT JOIN (
          select COUNT(DISTINCT(user_id)) as user_count, standard_id
           from best_per_standard_user
           where avg_score_in_standard >= #{@proficiency_cutoff}
           group by standard_id
        ) as proficient_count ON proficient_count.standard_id = standards.id"
      ).joins(<<-JOINS
      LEFT JOIN (
          select COUNT(DISTINCT(user_id)) as user_count, standard_id
           from best_per_standard_user
           where avg_score_in_standard < #{@proficiency_cutoff}
           group by standard_id
        ) as not_proficient_count ON not_proficient_count.standard_id = standards.id
      JOINS
      )
      .group('standards.id, standard_levels.name')
      .order('standards.name asc')
  end
end
