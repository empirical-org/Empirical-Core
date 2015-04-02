class Topic < ActiveRecord::Base

  belongs_to :section
  belongs_to :topic_category

  has_many :activities, dependent: :destroy

  default_scope -> { order(:name) }

  validates :section, presence: true
  validates :name, presence: true, uniqueness: true

  # TODO: REMOVE Old progress report functionality
  def self.for_progress_report(teacher, filters)
    with(filtered_activity_sessions: ActivitySession.proficient_sessions_for_progress_report(teacher, filters))
    .select(<<-SELECT
      topics.id as topic_id,
      topics.name as topic_name,
      topics.section_id as section_id,
      COUNT(DISTINCT(filtered_activity_sessions.user_id)) as students_count,
      SUM(filtered_activity_sessions.is_proficient) as proficient_count,
      SUM(CASE WHEN filtered_activity_sessions.is_proficient = 1 THEN 0 ELSE 1 END) as not_proficient_count,
      SUM(filtered_activity_sessions.time_spent) as total_time_spent
    SELECT
    ).joins(<<-JOINS
      JOIN activities ON activities.topic_id = topics.id
      JOIN filtered_activity_sessions ON filtered_activity_sessions.activity_id = activities.id
    JOINS
    ).group("topics.id")
    .order("topics.name asc")
  end

  def self.for_standards_report(teacher, filters)
    Topic.from_cte('best_activity_sessions', ActivitySession.for_standards_report(teacher, filters))
      .with(best_per_topic_user: User.best_per_topic_user)
      .select(<<-SQL
        topics.id,
        topics.name,
        sections.name as section_name,
        AVG(best_activity_sessions.percentage) as average_score,
        COUNT(DISTINCT(best_activity_sessions.activity_id)) as total_activity_count,
        COUNT(DISTINCT(best_activity_sessions.user_id)) as total_student_count,
        COALESCE(AVG(proficient_count.user_count), 0)::integer as proficient_student_count,
        COALESCE(AVG(near_proficient_count.user_count), 0)::integer as near_proficient_student_count,
        COALESCE(AVG(not_proficient_count.user_count), 0)::integer as not_proficient_student_count
      SQL
      ).joins('JOIN topics ON topics.id = best_activity_sessions.topic_id')
      .joins('JOIN sections ON sections.id = topics.section_id')
      .joins(<<-JOINS
      LEFT JOIN (
          select COUNT(DISTINCT(user_id)) as user_count, topic_id
           from best_per_topic_user
           where best_score_in_topic >= 0.75
           group by topic_id
        ) as proficient_count ON proficient_count.topic_id = topics.id
      JOINS
      ).joins(<<-JOINS
      LEFT JOIN (
          select COUNT(DISTINCT(user_id)) as user_count, topic_id
           from best_per_topic_user
           where best_score_in_topic < 0.75 AND best_score_in_topic >= 0.50
           group by topic_id
        ) as near_proficient_count ON near_proficient_count.topic_id = topics.id
      JOINS
      ).joins(<<-JOINS
      LEFT JOIN (
          select COUNT(DISTINCT(user_id)) as user_count, topic_id
           from best_per_topic_user
           where best_score_in_topic < 0.5
           group by topic_id
        ) as not_proficient_count ON not_proficient_count.topic_id = topics.id
      JOINS
      )
      .group('topics.id, sections.name')
      .order('topics.name asc')
  end

  def name_prefix
    name.split(' ').first
  end
end