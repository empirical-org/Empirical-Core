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
    classroom_activities = ClassroomActivity.where(unit_id: unit.id, activity_id: activity_id)
    classroom_activities.each do |ca|
      classroom_activity_hash = classroom_activity.attributes
      number_of_assigned_students = classroom_activity_hash[:assigned_student_ids].length
      if number_of_assigned_students > 0
        classroom_activity_hash[:number_of_assigned_students] = number_of_assigned_students
      else
        classroom_activity_hash[:number_of_assigned_students] = classroom_activity.classroom.students.count
      end
      classroom_activity_hash[:classroom_name] = classroom_activity.classroom.name
      classroom_activity_hash[:completed] = classroom_activity.has_a_completed_session?
    end
    classroom_activities
  end

end
