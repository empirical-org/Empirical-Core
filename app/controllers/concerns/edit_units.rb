module EditUnits

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

end
