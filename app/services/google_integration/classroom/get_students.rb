  def students(client)
    service = client.discovered_api('classroom', 'v1')
    api_method = service.courses.students.list
    result = client.execute(api_method: api_method,
                            parameters: {'courseId' => "455798942"})
  end
