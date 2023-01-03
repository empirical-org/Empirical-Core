# frozen_string_literal: true

module TeacherFixes
  extend ActiveSupport::Concern
  include AtomicArrays

  def self.merge_two_units(unit1, unit2)
    # move all additional information from unit1 into unit2
    # and then delete unit1
    ClassroomUnit.where(unit_id: unit1.id).each do |cu1|
      cu2 = ClassroomUnit.find_by(unit_id: unit2.id, classroom_id: cu1.classroom_id)
      if cu2
        merge_two_classroom_units(cu1, cu2)
      else
        cu1.update!(unit_id: unit2.id)
      end
    end
    UnitActivity.where(unit_id: unit1.id).each do |ua1|
      ua2 = UnitActivity.find_by(unit_id: unit2.id, activity_id: ua1.activity_id)
      if ua2
        ua1.update!(visible: false)
      else
        ua1.update!(unit_id: unit2.id)
      end
    end
  end

  def self.merge_two_classroom_units(cu1, cu2)
    # update cu1 activity sessions to belong to cu2
    merge_activity_sessions_between_two_classroom_units(cu1, cu2)
    # add all assigned students from cu1 to cu2
    all_assigned_students = cu1.assigned_student_ids.dup.concat(cu2.assigned_student_ids).uniq
    cu2.update(assigned_student_ids: all_assigned_students)
    cu2.unit.unit_activities.each do |ua|
      cuas1 = ClassroomUnitActivityState.find_by(classroom_unit: cu1, unit_activity: ua)
      cuas2 = ClassroomUnitActivityState.find_by(classroom_unit: cu2, unit_activity: ua)
      if cuas1 && !cuas2
        cuas1.update!(classroom_unit: cu2)
      elsif cuas1 && cuas2 && cuas1.updated_at > cuas2.updated_at
        cuas2.destroy!
        cuas1.update!(classroom_unit: cu2)
      end
    end
    cu1.update!(visible: false)
  end

  # rubocop:disable Lint/DuplicateBranch, Metrics/CyclomaticComplexity
  def self.merge_activity_sessions_between_two_classroom_units(cu1, cu2)
    # use the most recently completed activity session
    cu1.activity_sessions.each do |act_sesh1|
      act_sesh2 = ActivitySession.find_by(classroom_unit: cu2, activity: act_sesh1.activity, user: act_sesh1.user)
      if act_sesh2.blank?
        act_sesh1.update!(classroom_unit_id: cu2.id)
      elsif act_sesh2.started? && act_sesh1.finished?
        act_sesh2.update!(visible: false)
        act_sesh1.update!(classroom_unit_id: cu2.id)
      elsif act_sesh1.started? && act_sesh2.finished?
        act_sesh1.update!(visible: false)
      elsif act_sesh1.updated_at < act_sesh2.updated_at
        act_sesh1.update!(visible: false)
      else
        act_sesh2.update!(visible: false)
        act_sesh1.update!(classroom_unit_id: cu2.id)
      end
    end
  end
  # rubocop:enable Lint/DuplicateBranch, Metrics/CyclomaticComplexity

  def self.move_activity_sessions(user, classroom1, classroom2)
    classroom1_id = classroom1.id
    classroom2_id = classroom2.id
    user_id = user.id
    classroom_units = ClassroomUnit
    .joins("JOIN activity_sessions ON classroom_units.id = activity_sessions.classroom_unit_id")
    .joins("JOIN users ON activity_sessions.user_id = users.id")
    .where("users.id = ?", user_id)
    .where("classroom_units.classroom_id = ?", classroom1_id)
    .group("classroom_units.id")
    if classroom1.owner.id == classroom2.owner.id
      classroom_units.each do |ca|
        sibling_ca = ClassroomUnit.find_or_create_by(unit_id: ca.unit_id, classroom_id: classroom2_id)
        ActivitySession.where(classroom_unit_id: ca.id, user_id: user_id).each do |as|
          as.update(classroom_unit_id: sibling_ca.id)
          sibling_ca.assigned_student_ids.push(user_id)
          sibling_ca.save
        end
        user.hide_extra_activity_sessions(ca.id)
      end
    else
      new_unit_name = "#{user.name}'s Activities from #{classroom1.name}"
      unit = Unit.create(user_id: classroom2.owner.id, name: new_unit_name)
      classroom_units.each do |ca|
        new_cu = ClassroomUnit.find_or_create_by(unit_id: unit.id, classroom_id: classroom2_id, assigned_student_ids: [user_id])

        ActivitySession.where(classroom_unit_id: ca.id, user_id: user_id).each do |as|
          as.update(classroom_unit_id: new_cu.id)
          UnitActivity.find_or_create_by(unit_id: unit.id, activity_id: as.activity_id)
        end
        user.hide_extra_activity_sessions(ca.id)
      end
    end
  end

  def self.merge_two_schools(from_school_id, to_school_id)
    SchoolsUsers.where(school_id: from_school_id).update_all(school_id: to_school_id)
  end

  def self.merge_two_classrooms(source_classroom_id, target_classroom_id)
    move_students_from_one_class_to_another(source_classroom_id, target_classroom_id)

    move_classroom_units_and_activity_sessions_from_one_class_to_another(source_classroom_id, target_classroom_id)

    assign_teachers_to_other_class(source_classroom_id, target_classroom_id)
    Classroom.find(source_classroom_id).update(visible: false)
  end

  def self.move_students_from_one_class_to_another(source_classroom_id, target_classroom_id)
    StudentsClassrooms.where(classroom_id: source_classroom_id).each do |sc|
      if StudentsClassrooms.unscoped.find_by(classroom_id: target_classroom_id, student_id: sc.student_id)
        sc.skip_archive_student_associations = true
        sc.update(visible: false)
      else
        sc.update(classroom_id: target_classroom_id)
      end
    end
  end

  def self.move_classroom_units_and_activity_sessions_from_one_class_to_another(source_classroom_id, target_classroom_id)
    ClassroomUnit.where(classroom_id: source_classroom_id).each do |cu|
      existing_cu = ClassroomUnit.find_by(classroom_id: target_classroom_id, unit_id: cu.unit_id)
      if existing_cu
        cu.activity_sessions.update_all(classroom_unit_id: existing_cu.id)
        existing_cu.update(assigned_student_ids: cu.assigned_student_ids.concat(existing_cu.assigned_student_ids).uniq)
        existing_cu.assigned_student_ids.each do |student_id|
          student = User.find(student_id)
          student.hide_extra_activity_sessions(existing_cu.id)
        end
        cu.update(visible: false)
      else
        cu.update(classroom_id: target_classroom_id)
      end
    end
  end

  def self.assign_teachers_to_other_class(source_classroom_id, target_classroom_id)
    ClassroomsTeacher.where(classroom_id: source_classroom_id).each do |ct|
      if ClassroomsTeacher.where(user_id: ct.user_id, classroom_id: target_classroom_id).any?
        ct.destroy
      else
        ct.update(classroom_id: target_classroom_id, role: 'coteacher')
      end
    end
  end

  def self.delete_last_activity_session(user_id, activity_id)
    last_activity_session = get_all_completed_activity_sessions_for_a_given_user_and_activity(user_id, activity_id).order("activity_sessions.completed_at DESC").limit(1)[0]
    raise 'This activity session does not exist' unless last_activity_session

    last_activity_session.delete

    remaining_activity_sessions = get_all_completed_activity_sessions_for_a_given_user_and_activity(user_id, activity_id)
    return if remaining_activity_sessions.empty?
    return if remaining_activity_sessions.any?(&:is_final_score)
    return if remaining_activity_sessions.none? { |as| as.state == 'finished'}

    remaining_activity_sessions.order(:percentage).first.update(is_final_score: true)
  end

  def self.get_all_completed_activity_sessions_for_a_given_user_and_activity(user_id, activity_id)
    ActivitySession.joins("JOIN users ON activity_sessions.user_id = users.id")
    .where("users.id = ?", user_id)
    .where("activity_sessions.activity_id = ?", activity_id)
    .where("activity_sessions.visible = true")
    .where("activity_sessions.state = 'finished'")
  end

  def self.recover_classroom_units_and_associated_activity_sessions(classroom_units)
    classroom_units.each do |cu|
      activity_sessions = ActivitySession.unscoped.where(classroom_unit_id: cu.id)
      recovered_assigned_students = activity_sessions.map(&:user_id)
      cu.update(visible: true, assigned_student_ids: cu.assigned_student_ids.union(recovered_assigned_students))
      activity_sessions.update_all(visible: true)
      # update_all bypasses ActiveRecord callbacks, and thus doesn't
      # trigger the `touch` bubble-up that we use for cache invalidation.
      # So we need to do the touches manually.
      activity_sessions.each(&:touch)
      cu.save_user_pack_sequence_items
    end
  end

  def self.recover_unit_activities_for_units(units)
    unit_activities = UnitActivity.where(unit: units)
    unit_activities.update_all(visible: true)
    # update_all bypasses ActiveRecord callbacks, and thus doesn't
    # trigger the `touch` bubble-up that we use for cache invalidation.
    # So we need to do the touches manually.
    unit_activities.each(&:touch)
    unit_activities.each(&:save_user_pack_sequence_items)
  end

  def self.recover_units_by_id(unit_ids)
    units = Unit.unscoped.where(id: unit_ids)
    units.update_all(visible: true)
    # update_all bypasses ActiveRecord callbacks, and thus doesn't
    # trigger the `touch` bubble-up that we use for cache invalidation.
    # So we need to do the touches manually.
    units.each(&:touch)
    units.each(&:save_user_pack_sequence_items)
  end

end
