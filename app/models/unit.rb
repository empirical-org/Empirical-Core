class Unit < ActiveRecord::Base
  belongs_to :classroom
  has_many :classroom_activities, dependent: :destroy
  has_many :activities, through: :classroom_activities
  has_many :topics, through: :activities

  def self.for_progress_report(section_ids, teacher, filters)
    query = joins(:classroom_activities => [:activity_sessions, :classroom, {:activity => {:topic => :section}}])
      .where('sections.id IN (?)', section_ids)
      .where('classrooms.teacher_id = ?', teacher.id).uniq

    if filters[:classroom_id].present?
      query = query.where("classrooms.id = ?", filters[:classroom_id])
    end

    if filters[:student_id].present?
      query = query.where("activity_sessions.user_id = ?", filters[:student_id])
    end

    query
  end
end
