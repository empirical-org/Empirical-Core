# frozen_string_literal: true

module UnitQueries

  extend ActiveSupport::Concern

  def get_classrooms_with_students_and_classroom_units(unit, current_user)
    owns_unit = false
    if current_user.id == unit.user_id
      # then the user owns the unit, and cun affect change amongst all classes they own
      classrooms = current_user.classrooms_i_teach_with_students
    else
      classrooms = current_user.classrooms_i_am_the_coteacher_for_with_a_specific_teacher_with_students(unit.user_id)
    end
    classrooms.each do |c|
      classroom_unit = ClassroomUnit.select("id, assigned_student_ids, assign_on_join").where(classroom_id: c['id'], unit_id: unit.id, visible: true).limit(1)
      c[:classroom_unit] = classroom_unit.try(:first) || nil
    end
    classrooms
  end

  def get_classroom_units_for_activity(activity_id)
    # not the most efficient way of getting the ids

    classroom_units = ClassroomUnit.joins(
      " JOIN units ON classroom_units.unit_id = units.id
        JOIN unit_activities ON unit_activities.unit_id = units.id
      "
    ).where("classroom_units.classroom_id IN (?)", current_user.classrooms_i_teach.map(&:id)
    ).where("unit_activities.activity_id = ?", activity_id)
    classroom_units.map do |cu|
      classroom_unit_hash = cu.attributes
      number_of_assigned_students = cu.assigned_student_ids.length
      if number_of_assigned_students > 0
        classroom_unit_hash[:number_of_assigned_students] = number_of_assigned_students
      else
        classroom_unit_hash[:number_of_assigned_students] = cu.classroom.students.count
      end
      classroom_unit_hash[:classroom_name] = cu.classroom.name
      classroom_unit_hash[:completed] = ActivitySession.has_a_completed_session?(activity_id, cu.id)
      classroom_unit_hash[:started] = ActivitySession.has_a_started_session?(activity_id, cu.id)
      classroom_unit_hash[:activity_id] = activity_id
      classroom_unit_hash
    end
  end

end
