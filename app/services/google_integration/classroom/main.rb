module GoogleIntegration::Classroom::Main

  def self.fetch_data(user, access_token)
    client = self.client(access_token)
    send(user.role, user, client)
  end

  private

  def self.client(access_token)
    client = GoogleIntegration::Client.create(access_token)
  end

  def self.student(user, client)
    GoogleIntegration::Classroom::Student.run(user, self.courses(client))
  end

  def self.teacher(user, client)
    GoogleIntegration::Classroom::Teacher.run(user, self.courses(client), self.students_getter(client))
  end

  def self.courses(client)
    GoogleIntegration::Classroom::GetCourses::Processor.run(self.course_response(client))
  end

  def self.course_response(client)
    GoogleIntegration::Classroom::GetCourses::Requester.run(client)
  end

  def self.students_getter
    GoogleIntegration::Classroom::Teacher::CreateStudents::StudentsGetter::Main.generate(self.students_requester(client))
  end

  def self.students_requester(client)
    GoogleIntegration::Classroom::Teacher::CreateStudents::Requester.generate(client)
  end
end