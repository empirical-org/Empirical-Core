module GoogleIntegration::Classroom::Requester::Courses

  def self.run(client)
    service = client.discovered_api('classroom', 'v1')
    client.execute(api_method: service.courses.list)
  end
end