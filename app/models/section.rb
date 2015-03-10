class Section < ActiveRecord::Base
  include RankedModel

  ranks :position

  belongs_to :workbook
  has_many :topics, dependent: :destroy

  validates :name, presence: true

  def self.for_progress_report(teacher, filters)
    with(filtered_activity_sessions: ActivitySession.proficient_sessions_for_progress_report(teacher, filters))
    .select(<<-SELECT
      sections.id,
      sections.name as section_name,
      COUNT(DISTINCT(topics.id)) as topics_count,
      SUM(filtered_activity_sessions.is_proficient) as proficient_count,
      SUM(CASE WHEN filtered_activity_sessions.is_proficient = 1 THEN 0 ELSE 1 END) as not_proficient_count,
      SUM(filtered_activity_sessions.time_spent) as total_time_spent
    SELECT
    ).joins(<<-JOINS
      JOIN topics ON topics.section_id = sections.id
      JOIN activities ON activities.topic_id =  topics.id
      JOIN filtered_activity_sessions ON filtered_activity_sessions.activity_id = activities.id
    JOINS
    ).group('sections.id')
    .order('sections.name asc')
  end
end
