# frozen_string_literal: true

module Associators::StudentsToClassrooms

  # rubocop:disable Metrics/CyclomaticComplexity
  def self.run(student, classroom)
    @@classroom = classroom
    if legit_classroom && legit_teacher && (student&.role == 'student')
      @@classroom.update(updated_at: Time.current)
      begin
        sc = StudentsClassrooms.unscoped.find_or_initialize_by(student_id: student.id, classroom_id: classroom[:id])
        if sc.new_record?
          sc.visible = true
          if sc.save!
            update_classroom_units(sc)
            StudentJoinedClassroomWorker.perform_async(@@classroom&.owner&.id, student&.id)
          end
        end
      rescue ActiveRecord::RecordNotUnique
        retry
      end
      if !sc.visible
        update_classroom_units(sc)
        sc.update(visible: true)
      end
      student.reload
    end
    student
  end
  # rubocop:enable Metrics/CyclomaticComplexity

  def self.update_classroom_units(student_classroom)
    cus = ClassroomUnit.where(classroom_id: student_classroom.classroom_id)
    cus.each{|cu| cu.validate_assigned_student(student_classroom.student_id)}
  end

  def self.legit_classroom
    Classroom.find_by(id: @@classroom&.id, visible: true)
  end

  def self.legit_teacher
    @@classroom&.owner&.id
  end

end
