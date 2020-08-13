module GoogleIntegration::Classroom::Requesters::Courses

  def self.run(client, user)
    service = client.discovered_api('classroom', 'v1')
    parameters = user.teacher? ? { teacherId: user.google_id } : { studentId: user.google_id }
    google_api_call = client.execute(api_method: service.courses.list, parameters: parameters)
    google_api_call
  end
end
