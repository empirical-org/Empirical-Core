module UnitQueries

  extend ActiveSupport::Concern

  def get_classrooms_with_students_and_classroom_activities(unit_id)
    unit = Unit.find(unit_id)
    classrooms = User.find(unit.user_id).classrooms_i_teach_with_students
    classrooms.each do |c|
      classroom_activity = ClassroomActivity.select("id, assigned_student_ids").
                              where(classroom_id: c['id'], unit_id: unit.id).
                              limit(1)
      c[:classroom_activity] = classroom_activity.try(:first) || nil
    end
    classrooms
  end

  def get_classroom_activities_for_activity(unit, activity_id)
    classroom_activities = ClassroomActivity.where(unit_id: unit.id, activity_id: activity_id).map do |ca|
      classroom_activity_hash = ca.attributes
      number_of_assigned_students = ca.assigned_student_ids.length
      if number_of_assigned_students > 0
        classroom_activity_hash[:number_of_assigned_students] = number_of_assigned_students
      else
        classroom_activity_hash[:number_of_assigned_students] = ca.classroom.students.count
      end
      classroom_activity_hash[:classroom_name] = ca.classroom.name
      classroom_activity_hash[:completed] = ca.has_a_completed_session?
      classroom_activity_hash
    end
    classroom_activities
  end

end
