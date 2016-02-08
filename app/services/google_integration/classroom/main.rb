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
    GoogleIntegration::Classroom::Student.run(user, client)
  end

  def self.teacher(user)
    GoogleIntegration::Classroom::Teacher.run(user, client)
  end
end