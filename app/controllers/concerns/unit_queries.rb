module UnitQueries

  extend ActiveSupport::Concern

  def get_classrooms_with_students_and_classroom_activities(unit, current_user)
    owns_unit = false
    if current_user.id == unit.user_id
      # then the user owns the unit, and can affect change amongst all classes they own
      classrooms = current_user.classrooms_i_teach_with_students
    else
      classrooms = current_user.classrooms_i_am_the_coteacher_for_with_a_specific_teacher_with_students(unit.user_id)
    end
      classrooms.each do |c|
        classroom_activity = ClassroomActivity.select("id, assigned_student_ids, assign_on_join").where(classroom_id: c['id'], unit_id: unit.id).limit(1)
        c[:classroom_activity] = classroom_activity.try(:first) || nil
      end
    classrooms
  end

  def get_classroom_activities_for_activity(activity_id)
    # not the most efficient way of getting the ids
    classroom_activities = ClassroomActivity.where(classroom_id: current_user.classrooms_i_teach.map(&:id), activity_id: activity_id)
    classroom_activities.map do |ca|
      classroom_activity_hash = ca.attributes
      number_of_assigned_students = ca.assigned_student_ids.length
      if number_of_assigned_students > 0
        classroom_activity_hash[:number_of_assigned_students] = number_of_assigned_students
      else
        classroom_activity_hash[:number_of_assigned_students] = ca.classroom.students.count
      end
      classroom_activity_hash[:classroom_name] = ca.classroom.name
      classroom_activity_hash[:completed] = ca.has_a_completed_session?
      classroom_activity_hash[:started] = ca.has_a_started_session?
      classroom_activity_hash
    end
  end

end
