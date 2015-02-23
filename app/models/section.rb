class Section < ActiveRecord::Base

  include RankedModel

  ranks :position

  belongs_to :workbook
  has_many :topics, dependent: :destroy

  validates :name, presence: true

  def self.for_progress_report(teacher, filters)
    query = select(<<-SELECT
      sections.id as id,
      sections.name as section_name,
      COUNT(DISTINCT(topics.id)) as topics_count,
      SUM(CASE WHEN activity_sessions.percentage > 0.75 THEN 1 ELSE 0 END) as proficient_count,
      SUM(CASE WHEN activity_sessions.percentage <= 0.75 THEN 1 ELSE 0 END) as not_proficient_count,
      SUM(activity_sessions.time_spent) as total_time_spent
    SELECT
    ).joins(:topics => {:activities => {:classroom_activities => [:classroom, :activity_sessions]}})
      .group("sections.id")
      .where("classrooms.teacher_id = ?", teacher.id) # Filter based on teacher ID

    if filters[:classroom_id].present?
      query = query.where("classrooms.id = ?", filters[:classroom_id])
    end

    if filters[:student_id].present?
      query = query.where("activity_sessions.user_id = ?", filters[:student_id])
    end

    if filters[:unit_id].present?
      query = query.where("classroom_activities.unit_id = ?", filters[:unit_id])
    end

    results = ActiveRecord::Base.connection.select_all(query)
    results.to_hash
  end
end
