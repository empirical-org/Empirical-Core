class ProgressReports::Standards::NewTopic
  def initialize(teacher)
    @teacher = teacher
    @proficiency_cutoff = ProficiencyEvaluator.proficiency_cutoff
  end

  def results(filters)
    topic_id = filters ? filters["topic_id"] : nil
    student_id = filters ? filters["student_id"] : nil
    ::Topic.with(best_activity_sessions:
     ("SELECT activity_sessions.*, activities.topic_id FROM activity_sessions
          JOIN classroom_units ON activity_sessions.classroom_unit_id = classroom_units.id
          JOIN activities ON activity_sessions.activity_id = activities.id
          JOIN classrooms ON classroom_units.classroom_id = classrooms.id
          JOIN classrooms_teachers ON classrooms.id = classrooms_teachers.classroom_id AND classrooms_teachers.user_id = #{@teacher.id}
          WHERE activity_sessions.is_final_score
          #{topic_conditional(topic_id)}
          #{student_conditional(student_id)}
          AND activity_sessions.visible
          AND classroom_units.visible"))
      .with(best_per_topic_user: ProgressReports::Standards::Student.best_per_topic_user)
      .select(<<-SQL
        topics.id,
        topics.name,
        sections.name as section_name,
        AVG(best_activity_sessions.percentage) as average_score,
        COUNT(DISTINCT(best_activity_sessions.activity_id)) as total_activity_count,
        COUNT(DISTINCT(best_activity_sessions.user_id)) as total_student_count,
        COALESCE(AVG(proficient_count.user_count), 0)::integer as proficient_student_count,
        COALESCE(AVG(not_proficient_count.user_count), 0)::integer as not_proficient_student_count
      SQL
    ).joins('JOIN best_activity_sessions ON topics.id = best_activity_sessions.topic_id')
      .joins('JOIN sections ON sections.id = topics.section_id')
      .joins("LEFT JOIN (
          select COUNT(DISTINCT(user_id)) as user_count, topic_id
           from best_per_topic_user
           where avg_score_in_topic >= #{@proficiency_cutoff}
           group by topic_id
        ) as proficient_count ON proficient_count.topic_id = topics.id"
      ).joins(<<-JOINS
      LEFT JOIN (
          select COUNT(DISTINCT(user_id)) as user_count, topic_id
           from best_per_topic_user
           where avg_score_in_topic < #{@proficiency_cutoff}
           group by topic_id
        ) as not_proficient_count ON not_proficient_count.topic_id = topics.id
      JOINS
      )
      .group('topics.id, sections.name')
      .order('topics.name asc')
  end

  def topic_conditional(topic_id)
    if topic_id
      "AND activities.topic_id = #{topic_id}"
    end
  end

  def student_conditional(student_id)
    if student_id
      "AND activity_sessions.user_id = #{student_id}"
    end
  end
end
