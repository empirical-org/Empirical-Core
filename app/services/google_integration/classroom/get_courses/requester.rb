module GoogleIntegration::Classroom::GetCourses::Requester

  def self.run(client)
    service = client.discovered_api('classroom', 'v1')
    client.execute(api_method: service.courses.list)
  end
end