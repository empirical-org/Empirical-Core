class Section < ActiveRecord::Base
  include RankedModel
  include ProgressReportQuery

  ranks :position

  belongs_to :workbook
  has_many :topics, dependent: :destroy

  validates :name, presence: true

  def self.for_topic_progress_report(teacher, section_id)
    query = progress_report_base_query(teacher, {}).where('sections.id = ?', section_id).limit(1)
    get_query_results(query).first
  end

  def self.progress_report_select
    <<-SELECT
      sections.id as id,
      sections.name as section_name,
      COUNT(DISTINCT(topics.id)) as topics_count,
      SUM(CASE WHEN activity_sessions.percentage > 0.75 THEN 1 ELSE 0 END) as proficient_count,
      SUM(CASE WHEN activity_sessions.percentage <= 0.75 THEN 1 ELSE 0 END) as not_proficient_count,
      SUM(activity_sessions.time_spent) as total_time_spent
    SELECT
  end

  def self.progress_report_joins(filters)
    {:topics => {:activities => {:classroom_activities => [:classroom, :activity_sessions]}}}
  end

  def self.progress_report_group_by
    "sections.id"
  end

  def self.progress_report_order_by
    "section_name asc"
  end
end
