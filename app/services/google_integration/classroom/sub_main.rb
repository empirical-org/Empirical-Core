module GoogleIntegration::Classroom::SubMain

  def self.pull_and_save_data(user, course_response, students_requester)
    if user.role == 'teacher'
      self.teacher(user, course_response, students_requester)
    elsif user.role == 'student'
      self.student(user, course_response)
    end
  end

  private

  # this module should be the only one which knows about the requesters in GoogleIntegration::Classroom::Requesters
  # this way we dont have to worry about making real requests in specs


  def self.student(user, course_response)
    GoogleIntegration::Classroom::Student.run(user, self.courses(course_response))
  end

  def self.teacher(user, course_response, students_requester)
    GoogleIntegration::Classroom::Teacher.run(user, self.courses(course_response), students_requester)
  end

  def self.courses(course_response)
    GoogleIntegration::Classroom::Parsers::Courses.run(course_response)
  end

end