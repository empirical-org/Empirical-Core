module Associators::StudentsToClassrooms

  def self.run(student, classroom)
    @@classroom = classroom
    if self.legit_classroom && self.legit_teacher && (student.role == 'student')
      sc = StudentsClassrooms.unscoped.find_or_create_by(student_id: student.id, classroom_id: classroom[:id])
      sc.update(visible: true)
      student.reload
      student.assign_classroom_activities
    end
    student
  end

  private

  def self.legit_classroom
    Classroom.find_by(id: @@classroom.id, visible: true)
  end

  def self.legit_teacher
    @@classroom.teacher
  end

end
