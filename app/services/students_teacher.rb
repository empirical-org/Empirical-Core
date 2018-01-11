module StudentsTeacher

  def self.run(student)
    return nil if student.classrooms.empty?
    student.classrooms.first.owner
  end

end
