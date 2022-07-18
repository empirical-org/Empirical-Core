# frozen_string_literal: true

class LessonPlanner::UnitSerializer < ApplicationSerializer
  attributes :id, :name, :selectedActivities, :classrooms, :dueDates

  def dueDates
    object.unit_activities.uniq(&:activity).each_with_object({}) do |unit_activity, acc|
      acc[unit_activity.activity.id] = unit_activity.formatted_due_date
    end
  end

  def selectedActivities
    object.activities.uniq.map do |activity|
      ActivitySerializer.new(activity).as_json(root: false)
    end
  end

  def classrooms
    first_classroom_unit = object.classroom_units.first
    if first_classroom_unit.nil?
      c = []
    else
      c = first_classroom_unit.classroom.owner.classrooms_i_teach
    end

    sc = object.classroom_units.map(&:classroom).uniq
    uc = c - sc
    ucd = unselectedClassroomData(uc)
    scd = selectedClassroomData
    scd.concat(ucd)
    scd
  end

  private def unselectedClassroomData(classrooms)
    classrooms.map do |classroom|
      students = classroom.students.map do |student|
        { id: student.id, name: student.name, isSelected: false }
      end

      {
        classroom: classroom,
        students: students
      }
    end
  end

  private def selectedClassroomData
    object.classroom_units.map do |classroom_unit|
      {
        classroom: classroom_unit.classroom,
        students: students_result(
          classroom_unit.classroom.students,
          classroom_unit.assigned_student_ids
        )
      }
    end
  end

  private def students_result(students, assigned_student_ids)
    if assigned_student_ids.empty?
      all_students_selected(students)
    else
      select_certain_students(students, assigned_student_ids)
    end
  end


  private def all_students_selected(students)
    students.map do |student|
      {id: student.id, name: student.name, isSelected: true}
    end
  end

  private def select_certain_students(students, assigned_student_ids)
    students.map do |student|
      is_selected = assigned_student_ids.include?(student.id)
      {id: student.id, name: student.name, isSelected: is_selected}
    end
  end
end
