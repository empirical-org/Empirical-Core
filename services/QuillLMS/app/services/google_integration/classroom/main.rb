module GoogleIntegration::Classroom::Main

  def self.join_existing_google_classrooms(student)
    client = GoogleIntegration::Client.new(student).create
    GoogleIntegration::Classroom::Student.run(student, parse_courses(student, client))
  end

  def self.pull_data(user)
    client = GoogleIntegration::Client.new(user).create
    parse_courses(user, client)
  end

  def self.parse_courses(user, client)
    raw_course_response = GoogleIntegration::Classroom::Requesters::Courses.run(client, user)
    course_response = JSON.parse(raw_course_response.body, symbolize_names: true)
    if course_response.dig(:error, :status) == 'UNAUTHENTICATED'
      'UNAUTHENTICATED'
    # TODO: pass back any other errors and we can handle them on the front end
    # elsif course_response(:error)
    #   return error
    else
      students = GoogleIntegration::Classroom::Requesters::Students.generate(client)
      GoogleIntegration::Classroom::Parsers::Courses.run(user, course_response, students)
    end
  end
end
