module GoogleIntegration::Classroom::Teacher::CreateStudents::StudentsGetter::Requester

  def self.generate(client)
    lambda do |course_id|
      service = client.discovered_api('classroom', 'v1')
      api_method = service.courses.students.list
      response = client.execute(api_method: api_method,
                              parameters: {'courseId' => course_id})

      response
    end
  end
end
