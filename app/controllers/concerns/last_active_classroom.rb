module LastActiveClassroom
  extend ActiveSupport::Concern

  def self.last_active_classrooms(teacher_id, limit=nil)
    last_active_arr = Classroom.find_by_sql("SELECT classrooms.id FROM classrooms
      JOIN classroom_activities AS ca ON ca.classroom_id = classrooms.id
      JOIN activity_sessions AS acts ON acts.classroom_activity_id = ca.id
      WHERE classrooms.teacher_id = #{ActiveRecord::Base.sanitize(teacher_id)}
      AND classrooms.visible = true
      AND acts.state = 'finished'
      ORDER BY acts.completed_at DESC")
      # if there is anything in the array, return it with its id
      if last_active_arr.any?
        limit ? last_active_arr.map(&:id).uniq[0..limit - 1 ] : last_active_arr.map(&:id).uniq
      else
        []
      end
  end

end
