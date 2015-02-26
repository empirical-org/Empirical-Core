class Topic < ActiveRecord::Base

  belongs_to :section
  belongs_to :topic_category

  has_many :activities, dependent: :destroy

  default_scope -> { order(:name) }

  validates :section, presence: true
  validates :name, presence: true, uniqueness: true

  def self.for_progress_report(teacher, filters)
    query = select(<<-SELECT
      topics.id as topic_id,
      topics.name as topic_name,
      COUNT(DISTINCT(activity_sessions.user_id)) as students_count,
      SUM(CASE WHEN activity_sessions.percentage > 0.75 THEN 1 ELSE 0 END) as proficient_count,
      SUM(CASE WHEN activity_sessions.percentage <= 0.75 THEN 1 ELSE 0 END) as not_proficient_count,
      SUM(activity_sessions.time_spent) as total_time_spent
    SELECT
    ).joins(:activities => {:classroom_activities => [:classroom, :activity_sessions]})
      .group("topics.id")
      .where("topics.section_id = ?", filters[:section_id])
      .where("activity_sessions.state = ?", "finished")
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
