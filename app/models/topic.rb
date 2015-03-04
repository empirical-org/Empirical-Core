class Topic < ActiveRecord::Base
  include ProgressReportQuery

  belongs_to :section
  belongs_to :topic_category

  has_many :activities, dependent: :destroy

  default_scope -> { order(:name) }

  validates :section, presence: true
  validates :name, presence: true, uniqueness: true

  def self.progress_report_select
    <<-SELECT
      topics.id as topic_id,
      topics.name as topic_name,
      COUNT(DISTINCT(activity_sessions.user_id)) as students_count,
      SUM(CASE WHEN activity_sessions.percentage > 0.75 THEN 1 ELSE 0 END) as proficient_count,
      SUM(CASE WHEN activity_sessions.percentage <= 0.75 THEN 1 ELSE 0 END) as not_proficient_count,
      SUM(activity_sessions.time_spent) as total_time_spent
    SELECT
  end

  def self.progress_report_joins
    {:activities => {:classroom_activities => [:classroom, :activity_sessions]}}
  end

  def self.progress_report_group_by
    "topics.id"
  end

  def self.progress_report_order_by
    "topics.name asc"
  end
end