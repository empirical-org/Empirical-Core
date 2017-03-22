module Associators::StudentsToClassrooms

  def self.run(student, classroom)
    @@classroom = classroom
    if self.legit_classroom && self.legit_teacher
      student.students_classrooms.find_or_create_by(student_id: student.id, classroom_id: classroom[:id])
      student.reload
      student.assign_classroom_activities
    end
    student
  end

  private

  def self.legit_classroom
    @@classroom && @@classroom.visible
  end

  def self.legit_teacher
    @@classroom.teacher
  end

end
