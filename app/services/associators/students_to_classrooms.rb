module Associators::StudentsToClassrooms

  def self.run(student, classroom)
    @@classroom = classroom
    if self.legit_classroom && self.legit_teacher && (student.role == 'student')
      sc = StudentsClassrooms.unscoped.find_or_initialize_by(student_id: student.id, classroom_id: classroom[:id])
      if sc.new_record?
        puts 'i just called it in students to classrooms'
        puts 'here is the classroom ryan'
        puts @@classroom
        sc.save!
        puts 'here are the student attributes'
        puts student.attributes
        StudentJoinedClassroomWorker.perform_async(@@classroom.teacher_id, student.id)
      end
      sc.update(visible: true)
      student.reload
      student.assign_classroom_activities(classroom[:id])
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
