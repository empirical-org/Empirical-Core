class ProgressReports::Standards::NewStandard
  def initialize(teacher)
    @teacher = teacher
    @proficiency_cutoff = ProficiencyEvaluator.proficiency_cutoff
  end

  def results(filters)
    standard_id = filters ? filters["standard_id"] : nil
    student_id = filters ? filters["student_id"] : nil
    ::Standard.with(best_activity_sessions:
     ("SELECT activity_sessions.*, activities.standard_id FROM activity_sessions
          JOIN classroom_units ON activity_sessions.classroom_unit_id = classroom_units.id
          JOIN activities ON activity_sessions.activity_id = activities.id
          JOIN classrooms ON classroom_units.classroom_id = classrooms.id
          JOIN classrooms_teachers ON classrooms.id = classrooms_teachers.classroom_id AND classrooms_teachers.user_id = #{@teacher.id}
          WHERE activity_sessions.is_final_score
          #{standard_conditional(standard_id)}
          #{student_conditional(student_id)}
          AND activity_sessions.visible
          AND classroom_units.visible"))
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
    ).joins('JOIN best_activity_sessions ON standards.id = best_activity_sessions.standard_id')
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

  def standard_conditional(standard_id)
    if standard_id
      "AND activities.standard_id = #{standard_id}"
    end
  end

  def student_conditional(student_id)
    if student_id
      "AND activity_sessions.user_id = #{student_id}"
    end
  end
end
