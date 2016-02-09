module GoogleIntegration::Classroom::Teacher::Main

  def self.run(user, client, course_getter, students_getter)
    classrooms = self.create_classrooms(user, client, course_getter)
    students = self.create_students(client, classrooms, students_getter)
  end

  private

  def self.create_classrooms(user, client, course_getter)
    GoogleIntegration::Classroom::Teacher::CreateClassrooms.run(user, client, course_getter)
  end

  def self.create_students(client, classrooms, students_getter)
    GoogleIntegration::Classroom::Teacher::CreateStudents::Main.run(client, classrooms, students_getter)
  end
end