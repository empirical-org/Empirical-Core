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

  # def self.for_topic_progress_report(teacher, section_id)
  #   query = progress_report_base_query(teacher, {}).where('sections.id = ?', section_id).limit(1)
  #   get_query_results(query).first
  # end

  # def self.progress_report_select
  #   <<-SELECT
  #     sections.id as id,
  #     sections.name as section_name,
  #     COUNT(DISTINCT(topics.id)) as topics_count,
  #     SUM(CASE WHEN activity_sessions.percentage > 0.75 THEN 1 ELSE 0 END) as proficient_count,
  #     SUM(CASE WHEN activity_sessions.percentage <= 0.75 THEN 1 ELSE 0 END) as not_proficient_count,
  #     SUM(activity_sessions.time_spent) as total_time_spent
  #   SELECT
  # end

  # def self.progress_report_joins(filters)
  #   {:topics => {:activities => {:classroom_activities => [:classroom, :activity_sessions]}}}
  # end

  # def self.progress_report_group_by
  #   "sections.id"
  # end

  # def self.progress_report_order_by
  #   "section_name asc"
  # end
end
