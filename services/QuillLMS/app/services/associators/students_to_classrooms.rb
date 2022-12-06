# frozen_string_literal: true

module Associators::StudentsToClassrooms

  # rubocop:disable Metrics/CyclomaticComplexity
  def self.run(student, classroom)
    @@classroom = classroom

    if legit_classroom && legit_teacher && student&.student?
      @@classroom.update(updated_at: Time.current)

      begin
        student_classroom =
          StudentsClassrooms.unscoped.find_or_create_by!(student_id: student.id, classroom_id: classroom[:id])

        if student_classroom.previously_new_record?
          update_classroom_units(student_classroom)
          StudentJoinedClassroomWorker.perform_async(@@classroom&.owner&.id, student&.id)
        elsif student_classroom.archived?
          update_classroom_units(student_classroom)
          student_classroom.unarchive!
        end
      rescue ActiveRecord::RecordNotUnique
        retry
      end

      student.reload
    end

    student
  end
  # rubocop:enable Metrics/CyclomaticComplexity

  def self.update_classroom_units(student_classroom)
    ClassroomUnit
      .where(classroom_id: student_classroom.classroom_id)
      .each { |classroom_unit| classroom_unit.validate_assigned_student(student_classroom.student_id) }
  end

  def self.legit_classroom
    Classroom.find_by(id: @@classroom&.id, visible: true)
  end

  def self.legit_teacher
    @@classroom&.owner&.id
  end

end
