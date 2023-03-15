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
          student_classroom.validate_assigned_student
          StudentJoinedClassroomWorker.perform_async(@@classroom&.owner&.id, student&.id)
        elsif student_classroom.archived?
          student_classroom.validate_assigned_student
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

  def self.legit_classroom
    Classroom.find_by(id: @@classroom&.id, visible: true)
  end

  def self.legit_teacher
    @@classroom&.owner&.id
  end

end
