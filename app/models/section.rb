class Section < ActiveRecord::Base

  include RankedModel

  ranks :position

  belongs_to :workbook
  has_many :topics, dependent: :destroy

  validates :name, presence: true

  def self.for_progress_report(teacher)
    query = select(<<-SELECT
      sections.name,
      COUNT(DISTINCT(topics.id)) as topic_count,
      SUM(CASE WHEN activity_sessions.percentage > 0.75 THEN 1 ELSE 0 END) as proficient_count,
      SUM(CASE WHEN activity_sessions.percentage <= 0.75 THEN 1 ELSE 0 END) as not_proficient_count,
      SUM(activity_sessions.time_spent) as total_time_spent
    SELECT
    ).joins(:topics => {:activities => {:classroom_activities => [:activity_sessions, :classroom => :teacher]}})
      .group("sections.id")
      .where("users.id = ?", teacher.id) # Filter based on teacher ID

    results = ActiveRecord::Base.connection.select_all(query)
    results.to_hash
  end
end
