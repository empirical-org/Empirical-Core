module GoogleIntegration::Classroom::Main

  def self.pull_and_save_data(user, access_token)
    client = self.create_client(access_token)
    self.submain_pull_and_save_data(user, self.course_response(client), self.students_requester(client))
  end

  private

  # this module should be the only one which knows about the requesters in GoogleIntegration::Classroom::Requesters
  # this way we dont have to worry about making real requests in specs


  def self.create_client
    GoogleIntegration::Client.create(access_token)
  end

  def self.submain_pull_and_save_data(user, course_response, students_requester)
    GoogleIntegration::Classroom::SubMain.pull_and_save_data(user, course_response, students_requester)
  end

  def self.course_response(client)
    GoogleIntegration::Classroom::Requesters::Courses.run(client)
  end

  def self.students_requester(client)
    GoogleIntegration::Classroom::Requesters::Students.generate(client)
  end
end
