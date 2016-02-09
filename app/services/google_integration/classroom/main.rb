module GoogleIntegration::Classroom::Main

  def self.pull_and_save_data(user, access_token)
    client = self.client(access_token)
    send(user.role, user, client)
  end

  private

  # this module should be the only one which knows about the requesters in GoogleIntegration::Classroom::Requesters
  # this way we dont have to worry about making real requests in specs

  def self.client(access_token)
    client = GoogleIntegration::Client.create(access_token)
  end

  def self.student(user, client)
    GoogleIntegration::Classroom::Student.run(user, self.courses(client))
  end

  def self.teacher(user, client)
    GoogleIntegration::Classroom::Teacher.run(user, self.courses(client), self.students_requester(client))
  end

  def self.courses(client)
    GoogleIntegration::Classroom::Parsers::Courses.run(self.course_response(client))
  end

  def self.course_response(client)
    GoogleIntegration::Classroom::Requesters::Courses.run(client)
  end

  def self.students_requester(client)
    GoogleIntegration::Classroom::Requesters::Students.generate(client)
  end
end