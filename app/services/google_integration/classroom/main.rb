module GoogleIntegration::Classroom::Main

  def self.pull_and_save_data(user, access_token)
    client = GoogleIntegration::Client.create(access_token)
    GoogleIntegration::Classroom::SubMain.pull_and_save_data(user, self.course_response(client), access_token)
  end

  def self.pull_data(user, access_token)
    client = GoogleIntegration::Client.create(access_token)
    GoogleIntegration::Classroom::Parsers::Courses.run(self.course_response(client))
  end

  private

  def self.submain_pull_and_save_data(user, course_response, access_token)
    GoogleIntegration::Classroom::SubMain.pull_and_save_data(user, course_response, access_token)
  end

  def self.course_response(client)
    GoogleIntegration::Classroom::Requesters::Courses.run(client)
  end

end
