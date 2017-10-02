module TeacherFixes
  extend ActiveSupport::Concern

  def self.merge_activity_sessions(account1, account2)
    a1_grouped_activity_sessions = account1.activity_sessions.group_by { |as| as.classroom_activity_id }
    a2_grouped_activity_sessions = account2.activity_sessions.group_by { |as| as.classroom_activity_id }
    a2_grouped_activity_sessions.each do |ca_id, activity_sessions|
      activity_sessions.each {|as| as.update_columns(user_id: account1.id) }
      if a1_grouped_activity_sessions[ca_id]
        hide_extra_activity_sessions(ca_id, account1.id)
      else
        ClassroomActivity.find(ca_id).assigned_student_ids.push(account1.id)
      end
    end
  end

  def self.hide_extra_activity_sessions(ca_id, user_id)
    ActivitySession.joins("JOIN users ON activity_sessions.user_id = users.id")
    .joins("JOIN classroom_activities ON activity_sessions.classroom_activity_id = classroom_activities.id")
    .where("users.id = ?", user_id)
    .where("classroom_activities.id = ?", ca_id)
    .where("activity_sessions.visible = true")
    .order("activity_sessions.is_final_score DESC, activity_sessions.percentage ASC, activity_sessions.started_at")
    .offset(1)
    .update_all(visible: false)
  end

  def self.same_classroom?(id1, id2)
    ActiveRecord::Base.connection.execute("SELECT A.student_id, B.student_id, A.classroom_id
      FROM students_classrooms A, students_classrooms B
      WHERE A.student_id = #{ActiveRecord::Base.sanitize(id1)}
      AND B.student_id = #{ActiveRecord::Base.sanitize(id2)}
      AND A.classroom_id = B.classroom_id").to_a.any?
  end

  def self.move_activity_sessions(user_id, classroom_1_id, classroom_2_id)
    classroom_activities = ClassroomActivity
    .joins("JOIN activity_sessions ON classroom_activities.id = activity_sessions.classroom_activity_id")
    .joins("JOIN users ON activity_sessions.user_id = users.id")
    .where("users.id = ?", user_id)
    .where("classroom_activities.classroom_id = ?", classroom_1_id)
    .group("classroom_activities.id")
    classroom_activities.each do |ca|
      sibling_ca = ClassroomActivity.find_or_create_by(unit_id: ca.unit_id, activity_id: ca.activity_id, classroom_id: classroom_2_id)
      ActivitySession.where(classroom_activity_id: ca.id, user_id: user_id).each { |as| as.update(classroom_activity_id: sibling_ca.id)}
      hide_extra_activity_sessions(ca.id, user_id)
    end
  end

end
