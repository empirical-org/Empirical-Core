class ProgressReports::Standards::AllClassroomsTopic
  def initialize(teacher)
    @teacher = teacher
    @proficiency_cutoff = ProficiencyEvaluator.proficiency_cutoff
  end

  def results(classroom_id, student_id)
    ActiveRecord::Base.connection.execute("WITH final_activity_sessions AS
     (SELECT activity_sessions.*, activities.topic_id FROM activity_sessions
          JOIN classroom_activities ON activity_sessions.classroom_activity_id = classroom_activities.id
          JOIN activities ON classroom_activities.activity_id = activities.id
          JOIN topics ON topics.id = activities.topic_id
          #{classroom_joins(classroom_id)}
          WHERE activity_sessions.is_final_score
          #{student_condition(student_id)}
          #{classroom_condition(classroom_id)}
          AND activity_sessions.visible
          AND classroom_activities.visible)
      SELECT topics.id,
        topics.name,
        sections.name as section_name,
        COUNT(DISTINCT(final_activity_sessions.activity_id)) as total_activity_count,
        COUNT(DISTINCT(final_activity_sessions.user_id)) as total_student_count,
        COUNT(DISTINCT(avg_score_for_topic_by_user.user_id)) as proficient_count
        FROM topics
          JOIN sections ON sections.id = topics.section_id
          JOIN final_activity_sessions ON final_activity_sessions.topic_id = topics.id
          LEFT JOIN (select topic_id, user_id, AVG(percentage) as avg_score
          FROM final_activity_sessions
          GROUP BY final_activity_sessions.topic_id, final_activity_sessions.user_id
          HAVING AVG(percentage) >= 0.8
          ) as avg_score_for_topic_by_user ON avg_score_for_topic_by_user.topic_id = topics.id
        GROUP BY topics.id, sections.name
        ORDER BY topics.name asc").to_a
  end

  def classroom_joins(classroom_id)
    if !classroom_id
      "JOIN classrooms ON classroom_activities.classroom_id = classrooms.id JOIN classrooms_teachers ON classrooms.id = classrooms_teachers.classroom_id AND classrooms_teachers.user_id = #{@teacher.id} AND classrooms.visible = true"
    end
  end

  def classroom_condition(classroom_id)
    if classroom_id
      "AND classroom_activities.classroom_id = #{classroom_id}"
    end
  end

  def student_condition(student_id)
    if student_id
      "AND activity_sessions.user_id = #{student_id}"
    end
  end
end
