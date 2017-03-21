module GoogleIntegration::Classroom::Main

  def self.join_existing_google_classrooms(student, access_token)
    client = GoogleIntegration::Client.create(access_token)
    GoogleIntegration::Classroom::Student.run(student, self.parse_courses(student, client))
  end

  def self.pull_data(user, access_token)
    client = GoogleIntegration::Client.create(access_token)
    self.parse_courses(user, client)
  end

  private

  def self.parse_courses(user, client)
    course_response = GoogleIntegration::Classroom::Requesters::Courses.run(client)
    GoogleIntegration::Classroom::Parsers::Courses.run(user, course_response)
  end

end
