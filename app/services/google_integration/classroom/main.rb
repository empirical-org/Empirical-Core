module GoogleIntegration::Classroom::Main

  def self.pull_and_save_data(user, access_token)
    client = GoogleIntegration::Client.create(access_token)
    if user.role == 'teacher'
      GoogleIntegration::Classroom::Teacher.run(user, self.parse_courses(user, client), access_token)
    elsif user.role == 'student'
      GoogleIntegration::Classroom::Student.run(user, self.parse_courses(user, client))
    end
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
