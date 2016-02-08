module GoogleIntegration::Classroom::GetCourses

  def self.run(client)
    service = client.discovered_api('classroom', 'v1')
    response = client.execute(api_method: service.courses.list)
    courses = self.parse_response(response)
    courses
  end

  # keep this here.
  # if the response changes, then we've localized the 'translation' work to this module
  def self.parse_response(response)
    courses = response["courses"].map do |hash|
      {id: hash[:id], name: hash[:name]}
    end
  end
end

=begin
example response :

{"courses":[{"id":"455798942","name":"class1","ownerId":"117520115627269298978","creationTime":"2016-02-01T21:19:54.662Z","updateTime":"2016-02-01T21:20:39.424Z","enrollmentCode":"w5o4h0v","courseState":"ACTIVE","alternateLink":"http://classroom.google.com/c/NDU1Nzk4OTQy"}]}

=end

