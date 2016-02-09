module GoogleIntegration::Classroom::Teacher::Main

  def self.run(user, courses, students_requester)
    classrooms = self.create_classrooms(user, courses)
    students   = self.create_students(classrooms, students_requester)
  end

  private

  def self.create_classrooms(user, courses)
    GoogleIntegration::Classroom::Creators::Classrooms.run(user, courses)
  end

  def self.create_students(classrooms, students_requester)
    GoogleIntegration::Classroom::Creators::Students.run(classrooms, students_requester)
  end
end