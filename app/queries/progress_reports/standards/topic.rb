class ProgressReports::Standards::Topic
  def initialize(teacher)
    @teacher = teacher
    @proficiency_cutoff = ProficiencyEvaluator.proficiency_cutoff
  end

  def results(filters)
    best_activity_sessions = ProgressReports::Standards::ActivitySession.new(@teacher).results(filters)
    ::Topic.from_cte('best_activity_sessions', best_activity_sessions)
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
      ).joins('JOIN topics ON topics.id = best_activity_sessions.topic_id')
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
end
