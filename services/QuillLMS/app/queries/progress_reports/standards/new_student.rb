class ProgressReports::Standards::NewStudent
  def initialize(teacher)
    @teacher = teacher
    @proficiency_cutoff = ProficiencyEvaluator.proficiency_cutoff
  end

  def results(filters)
    topic_id = filters ? filters["topic_id"] : nil
    classroom_id = filters ? filters["classroom_id"] : nil
    results = ::User.with(best_activity_sessions:
     ("SELECT activity_sessions.*, activities.topic_id FROM activity_sessions
          JOIN classroom_activities ON activity_sessions.classroom_activity_id = classroom_activities.id
          JOIN activities ON classroom_activities.activity_id = activities.id
          JOIN classrooms ON classroom_activities.classroom_id = classrooms.id
          JOIN classrooms_teachers ON classrooms.id = classrooms_teachers.classroom_id AND classrooms_teachers.user_id = #{@teacher.id}
          WHERE activity_sessions.is_final_score
          #{topic_conditional(topic_id)}
          #{classroom_conditional(classroom_id)}
          AND activity_sessions.visible
          AND classroom_activities.visible")).with(best_per_topic_user: ProgressReports::Standards::Student.best_per_topic_user).select(<<-SQL
        users.id,
        users.name,
        #{User.sorting_name_sql},
        AVG(best_activity_sessions.percentage) as average_score,
        COUNT(DISTINCT(best_activity_sessions.topic_id)) as total_standard_count,
        COUNT(DISTINCT(best_activity_sessions.activity_id)) as total_activity_count,
        COALESCE(AVG(proficient_count.topic_count), 0)::integer as proficient_standard_count,
        COALESCE(AVG(not_proficient_count.topic_count), 0)::integer as not_proficient_standard_count
      SQL
    ).joins('JOIN best_activity_sessions ON users.id = best_activity_sessions.user_id')
      .joins("
      LEFT JOIN (
          select COUNT(DISTINCT(topic_id)) as topic_count, user_id
           from best_per_topic_user
           where avg_score_in_topic >= #{@proficiency_cutoff}
           group by user_id
        ) as proficient_count ON proficient_count.user_id = users.id"
      ).joins(<<-JOINS
      LEFT JOIN (
          select COUNT(DISTINCT(topic_id)) as topic_count, user_id
           from best_per_topic_user
           where avg_score_in_topic < #{@proficiency_cutoff}
           group by user_id
        ) as not_proficient_count ON not_proficient_count.user_id = users.id
      JOINS
      )
      .group('users.id, sorting_name')
      .order('sorting_name asc')
      results
  end

  # Helper method used as CTE in other queries. Do not attempt to use this by itself
  def self.best_per_topic_user
    <<-BEST
      select topic_id, user_id, AVG(percentage) as avg_score_in_topic
      from best_activity_sessions
      group by topic_id, user_id
    BEST
  end

  def topic_conditional(topic_id)
    if topic_id
      "AND activities.topic_id = #{topic_id}"
    end
  end

  def classroom_conditional(classroom_id)
    if classroom_id && classroom_id != 0 && classroom_id != '0'
      "AND classrooms.id = #{classroom_id}"
    end
  end
end
