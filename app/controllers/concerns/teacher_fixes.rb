module TeacherFixes
  extend ActiveSupport::Concern
  include AtomicArrays

  def self.merge_activity_sessions(account1, account2)
    a1_grouped_activity_sessions = account1.activity_sessions.group_by { |as| as.classroom_activity_id }
    a2_grouped_activity_sessions = account2.activity_sessions.group_by { |as| as.classroom_activity_id }
    a2_grouped_activity_sessions.each do |ca_id, activity_sessions|
      activity_sessions.each {|as| as.update_columns(user_id: account1.id) }
      if a1_grouped_activity_sessions[ca_id]
        hide_extra_activity_sessions(ca_id, account1.id)
      else
        ClassroomActivity.find(ca_id).atomic_append(:assigned_student_ids, account1.id)
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

  def self.merge_two_units(unit_1, unit_2)
    # move all additional information from unit_1 into unit_2
    # and then delete unit_1
    ClassroomActivity.where(unit_id: unit_1.id).each do |ca_1|
      ca_2 = ClassroomActivity.find_by(unit_id: unit_2.id, activity_id: ca_1.activity_id, classroom_id: ca_1.classroom_id)
      if ca_2
        self.merge_two_classroom_activities(ca_1, ca_2)
      else
        ca_1.update!(unit_id: unit_2.id)
      end
    end
    unit_1.destroy
  end

  def self.merge_two_classroom_activities(ca_1, ca_2)
    # add all assigned students from ca_1 to ca_2
    all_assigned_students = ca_1.assigned_student_ids.push(ca_2.assigned_student_ids).flatten.uniq
    ca_2.update(assigned_student_ids: all_assigned_students)
    # update ca_1 activity sessions to belong to ca_2
    self.merge_activity_sessions_between_two_classroom_activities(ca_1, ca_2)
    ca_1.destroy
  end

  def self.merge_activity_sessions_between_two_classroom_activities(ca_1, ca_2)
    ca_1.activity_sessions.each{|act_sesh| act_sesh.update(classroom_activity_id: ca_2.id)}
  end

  def self.move_activity_sessions(user, classroom_1, classroom_2)
    classroom_1_id = classroom_1.id
    classroom_2_id = classroom_2.id
    user_id = user.id
    classroom_activities = ClassroomActivity
    .joins("JOIN activity_sessions ON classroom_activities.id = activity_sessions.classroom_activity_id")
    .joins("JOIN users ON activity_sessions.user_id = users.id")
    .where("users.id = ?", user_id)
    .where("classroom_activities.classroom_id = ?", classroom_1_id)
    .group("classroom_activities.id")
    if (classroom_1.owner.id == classroom_2.owner.id)
      classroom_activities.each do |ca|
        sibling_ca = ClassroomActivity.find_or_create_by(unit_id: ca.unit_id, activity_id: ca.activity_id, classroom_id: classroom_2_id)
        ActivitySession.where(classroom_activity_id: ca.id, user_id: user_id).each do |as|
          as.update(classroom_activity_id: sibling_ca.id)
          sibling_ca.assigned_student_ids.push(user_id)
          sibling_ca.save
        end
        hide_extra_activity_sessions(ca.id, user_id)
      end
    else
      new_unit_name = "#{user.name}'s Activities from #{classroom_1.name}"
      unit = Unit.create(user_id: classroom_2.owner.id, name: new_unit_name)
      classroom_activities.each do |ca|
        new_ca = ClassroomActivity.find_or_create_by(unit_id: unit.id, activity_id: ca.activity_id, classroom_id: classroom_2_id, assigned_student_ids: [user_id])
        ActivitySession.where(classroom_activity_id: ca.id, user_id: user_id).each { |as| as.update(classroom_activity_id: new_ca.id)}
        hide_extra_activity_sessions(ca.id, user_id)
      end
    end
  end

  def self.merge_two_schools(from_school_id, to_school_id)
    SchoolsUsers.where(school_id: from_school_id).update_all(school_id: to_school_id)
  end

  def self.merge_two_classrooms(class_id_1, class_id_2)
    move_students_from_one_class_to_another(class_id_1, class_id_2)

    move_classroom_activities_and_activity_sessions_from_one_class_to_another(class_id_1, class_id_2)

    assign_teachers_to_other_class(class_id_1, class_id_2)
    Classroom.find(class_id_1).update(visible: false)
  end

  def self.move_students_from_one_class_to_another(class_id_1, class_id_2)
    StudentsClassrooms.where(classroom_id: class_id_1).each do |sc|
      if StudentsClassrooms.find_by(classroom_id: class_id_2, student_id: sc.student_id)
        sc.update(visible: false)
      else
        sc.update(classroom_id: class_id_2)
      end
    end
  end

  def self.move_classroom_activities_and_activity_sessions_from_one_class_to_another(class_id_1, class_id_2)
    ClassroomActivity.where(classroom_id: class_id_1).each do |ca|
      extant_ca = ClassroomActivity.find_by(classroom_id: class_id_2, activity_id: ca.activity_id, unit_id: ca.unit_id)
      if extant_ca
        ca.activity_sessions.update_all(classroom_activity_id: extant_ca.id)
        extant_ca.update(assigned_student_ids: ca.assigned_student_ids.concat(extant_ca.assigned_student_ids).uniq)
        extant_ca.assigned_student_ids.each do |student_id|
          hide_extra_activity_sessions(extant_ca.id, student_id)
        end
        ca.update(visible: false)
      else
        ca.update(classroom_id: class_id_2)
      end
    end
  end

  def self.assign_teachers_to_other_class(class_id_1, class_id_2)
    ClassroomsTeacher.where(classroom_id: class_id_1).each do |ct|
      if ClassroomsTeacher.where(user_id: ct.user_id, classroom_id: class_id_2).any?
        ct.destroy
      else
        ct.update(classroom_id: class_id_2, role: 'coteacher')
      end
    end
  end

  def self.delete_last_activity_session(user_id, activity_id)
    last_activity_session = get_all_completed_activity_sessions_for_a_given_user_and_activity(user_id, activity_id).order("activity_sessions.completed_at DESC").limit(1)[0]
    if last_activity_session
      last_activity_session.delete
    else
      raise 'This activity session does not exist'
    end

    remaining_activity_sessions = get_all_completed_activity_sessions_for_a_given_user_and_activity(user_id, activity_id)
    if remaining_activity_sessions.length > 1 && remaining_activity_sessions.none? { |as| as.is_final_score} && remaining_activity_sessions.any? { |as| as.state === 'finished'}
      remaining_activity_sessions.order(:percentage).first.update(is_final_score: true)
    end
  end

  def self.get_all_completed_activity_sessions_for_a_given_user_and_activity(user_id, activity_id)
    ActivitySession.joins("JOIN users ON activity_sessions.user_id = users.id")
    .joins("JOIN classroom_activities ON activity_sessions.classroom_activity_id = classroom_activities.id")
    .where("users.id = ?", user_id)
    .where("classroom_activities.activity_id = ?", activity_id)
    .where("activity_sessions.visible = true")
    .where("activity_sessions.state = 'finished'")
  end

end
