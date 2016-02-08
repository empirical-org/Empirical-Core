module GoogleIntegration::Classroom::Teacher::Main

  def self.run(user, client)
    classrooms = self.create_classrooms(user, client)
    students = self.create_students(client, classrooms)
  end

  private

  def self.create_classrooms(user, client)
    GoogleIntegration::Classroom::Teacher::CreateClassrooms.run(user, client)
  end

  def self.create_students(client, classrooms)
    GoogleIntegration::Classroom::Teacher::CreateStudents::Main.run(client, classrooms)
  end
end