class Unit < ActiveRecord::Base
  belongs_to :classroom
  has_many :classroom_activities, dependent: :destroy
  has_many :activities, through: :classroom_activities
  has_many :topics, through: :activities

  def self.for_progress_report(teacher, filters)
    query = joins(:classroom_activities => [:activity_sessions, :classroom, {:activity => :topic}])
      .where("activity_sessions.state = ?", "finished")
      .where('classrooms.teacher_id = ?', teacher.id)
      .uniq
      .order('units.name asc')

    if filters[:section_id].present?
      query = query.where('topics.section_id IN (?)', filters[:section_id])
    end

    if filters[:classroom_id].present?
      query = query.where("classrooms.id = ?", filters[:classroom_id])
    end

    if filters[:student_id].present?
      query = query.where("activity_sessions.user_id = ?", filters[:student_id])
    end

    query
  end
end
