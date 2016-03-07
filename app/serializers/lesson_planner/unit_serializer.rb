class LessonPlanner::UnitSerializer < ActiveModel::Serializer
  attributes :id, :name, :selected_activities, :classrooms, :dueDates

  private

  def selected_activities
    object.classroom_activities.map(&:activity).uniq.map{|a| {id: a.id, name: a.name} }
  end

  def classrooms
    object.classroom_activities.uniq(&:classroom).map do |classroom_activity|
      classroom_result(classroom_activity)
    end
  end

  def classroom_result(classroom_activity)
    classroom = classroom_activity.classroom
    {
     id: classroom.id,
     name: classroom.name,
     students: students_result(classroom.students, classroom_activity.assigned_student_ids)
    }
  end

  def students_result(students, assigned_student_ids)
    if assigned_student_ids.empty?
      all_students_selected(students)
    else
      select_certain_students(students, assigned_student_ids)
    end
  end


  def all_students_selected(students)
    students.map do |student|
      {id: student.id, name: student.name, isSelected: true}
    end
  end

  def select_certain_students(students, assigned_student_ids)
    students.map do |student|
      isSelected = assigned_student_ids.include?(student.id)
      {id: student.id, name: student.name, isSelected: isSelected}
    end
  end

  def dueDates
    object.classroom_activities.uniq(&:activity).reduce({}) do |acc, ca|
      acc[ca.activity.id] = ca.due_date
      acc
    end
  end
end