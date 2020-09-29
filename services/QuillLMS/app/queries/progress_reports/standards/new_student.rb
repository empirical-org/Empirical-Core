class ProgressReports::Standards::NewStudent
  def initialize(teacher)
    @teacher = teacher
    @proficiency_cutoff = ProficiencyEvaluator.proficiency_cutoff
  end

  def results(filters)
    standard_id = filters ? filters["standard_id"] : nil
    classroom_id = filters ? filters["classroom_id"] : nil
    results = ::User.with(best_activity_sessions:
     ("SELECT activity_sessions.*, activities.standard_id FROM activity_sessions
          JOIN classroom_units ON activity_sessions.classroom_unit_id = classroom_units.id
          JOIN activities ON activity_sessions.activity_id = activities.id
          JOIN classrooms ON classroom_units.classroom_id = classrooms.id
          JOIN classrooms_teachers ON classrooms.id = classrooms_teachers.classroom_id AND classrooms_teachers.user_id = #{@teacher.id}
          WHERE activity_sessions.is_final_score
          #{standard_conditional(standard_id)}
          #{classroom_conditional(classroom_id)}
          AND activity_sessions.visible
          AND classroom_units.visible")).with(best_per_standard_user: ProgressReports::Standards::Student.best_per_standard_user).select(<<-SQL
        users.id,
        users.name,
        #{User.sorting_name_sql},
        AVG(best_activity_sessions.percentage) as average_score,
        COUNT(DISTINCT(best_activity_sessions.standard_id)) as total_standard_count,
        COUNT(DISTINCT(best_activity_sessions.activity_id)) as total_activity_count,
        COALESCE(AVG(proficient_count.standard_count), 0)::integer as proficient_standard_count,
        COALESCE(AVG(not_proficient_count.standard_count), 0)::integer as not_proficient_standard_count
          SQL
    ).joins('JOIN best_activity_sessions ON users.id = best_activity_sessions.user_id')
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
      results
  end

  # Helper method used as CTE in other queries. Do not attempt to use this by itself
  def self.best_per_standard_user
    <<-BEST
      select standard_id, user_id, AVG(percentage) as avg_score_in_standard
      from best_activity_sessions
      group by standard_id, user_id
    BEST
  end

  def standard_conditional(standard_id)
    if standard_id
      "AND activities.standard_id = #{standard_id}"
    end
  end

  def classroom_conditional(classroom_id)
    if classroom_id && classroom_id != 0 && classroom_id != '0'
      "AND classrooms.id = #{classroom_id}"
    end
  end
end
