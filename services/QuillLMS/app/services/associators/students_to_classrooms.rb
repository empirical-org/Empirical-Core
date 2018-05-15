module Associators::StudentsToClassrooms

  def self.run(student, classroom)
    @@classroom = classroom
    if self.legit_classroom && self.legit_teacher && (student&.role == 'student')
      sc = StudentsClassrooms.unscoped.find_or_initialize_by(student_id: student.id, classroom_id: classroom[:id])
      if sc.new_record?
        sc.visible = true
        if sc.save!
          update_classroom_activities(sc)
          StudentJoinedClassroomWorker.perform_async(@@classroom.owner.id, student.id)
        end
      end
      if !sc.visible
        update_classroom_activities(sc)
        sc.update(visible: true)
      end
      student.reload
    end
    student
  end

  private

  def self.update_classroom_activities(sc)
    cas = ClassroomActivity.where(classroom_id: sc.classroom_id)
    cas.each{|ca| ca.validate_assigned_student(sc.student_id)}
  end

  def self.legit_classroom
    Classroom.find_by(id: @@classroom.id, visible: true)
  end

  def self.legit_teacher
    @@classroom.owner
  end

end
