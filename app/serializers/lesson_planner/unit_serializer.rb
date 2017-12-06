class LessonPlanner::UnitSerializer < ActiveModel::Serializer
  attributes :id, :name, :selectedActivities, :classrooms, :dueDates

  private

  def selectedActivities
    classroom_activities.map(&:activity).uniq.map{|a| ActivitySerializer.new(a, root: false).as_json }
  end

  def classroom_activities
    object.classroom_activities.to_a
  end

  def classrooms
    first_ca = classroom_activities.first
    if first_ca.nil?
      c = []
    else
      c = first_ca.classroom.owner.classrooms_i_teach
    end

    sc = classroom_activities.map(&:classroom).uniq
    uc = c - sc
    ucd = unselectedClassroomData(uc)
    scd = selectedClassroomData
    scd.concat(ucd)
    scd
  end

  def unselectedClassroomData(classrooms)
    classrooms.map do |c|
      students = c.students.map{ |s| {id: s.id, name: s.name, isSelected: false} }
      {
        classroom: c,
        students: students
      }
    end
  end

  def selectedClassroomData
    classroom_activities.uniq(&:classroom).map do |ca|
      {
        classroom: ca.classroom,
        students: students_result(ca.classroom.students, ca.assigned_student_ids)
      }
    end
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
    classroom_activities.uniq(&:activity).reduce({}) do |acc, ca|
      acc[ca.activity.id] = ca.formatted_due_date
      acc
    end
  end
end
