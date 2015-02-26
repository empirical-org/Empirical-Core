class Section < ActiveRecord::Base

  include RankedModel

  ranks :position

  belongs_to :workbook
  has_many :topics, dependent: :destroy

  validates :name, presence: true

  # TODO: All of the code below should belong in its own query object

  def self.for_progress_report(teacher, filters)
    query = progress_report_base_query(teacher)
    if filters[:classroom_id].present?
      query = query.where("classrooms.id = ?", filters[:classroom_id])
    end

    if filters[:student_id].present?
      query = query.where("activity_sessions.user_id = ?", filters[:student_id])
    end

    if filters[:unit_id].present?
      query = query.where("classroom_activities.unit_id = ?", filters[:unit_id])
    end

    get_query_results(query)
  end

  def self.for_topic_progress_report(teacher, section_id)
    query = progress_report_base_query(teacher).where('sections.id = ?', section_id).limit(1)
    get_query_results(query).first
  end

  def self.progress_report_base_query(teacher)
    select(<<-SELECT
      sections.id as id,
      sections.name as section_name,
      COUNT(DISTINCT(topics.id)) as topics_count,
      SUM(CASE WHEN activity_sessions.percentage > 0.75 THEN 1 ELSE 0 END) as proficient_count,
      SUM(CASE WHEN activity_sessions.percentage <= 0.75 THEN 1 ELSE 0 END) as not_proficient_count,
      SUM(activity_sessions.time_spent) as total_time_spent
    SELECT
    ).joins(:topics => {:activities => {:classroom_activities => [:classroom, :activity_sessions]}})
      .group("sections.id")
      .where("activity_sessions.state = ?", "finished")
      .where("classrooms.teacher_id = ?", teacher.id) # Filter based on teacher ID
  end

  def self.get_query_results(query)
    results = ActiveRecord::Base.connection.select_all(query)
    results.to_hash
  end
end
