module GoogleIntegration::Classroom::Teacher::CreateStudents::Get

  def self.run(client, course_id)
    service = client.discovered_api('classroom', 'v1')
    api_method = service.courses.students.list
    response = client.execute(api_method: api_method,
                            parameters: {'courseId' => course_id})

    student_data = self.parse_response(response)
    student_data
  end

  private

  def self.parse_response(response)
    x = JSON.parse(response.body)
    student_data = x['students'].map do |hash|
      self.parse_hash(hash)
    end
  end

  def self.parse_hash(hash)
    profile_data = hash['profile']
    {
      name: profile_data['name']['fullName'],
      email: profile_data['emailAddress']
    }
  end

end

=begin

example result of JSON.parse(response.body) :

{"students":
  [
    {"courseId":"455798942",
     "userId":"107708392406225674265",
     "profile":
        {"id":"107708392406225674265",
         "name":
          {"givenName":"test1_s1",
           "familyName":"s1",
           "fullName":"test1_s1 s1"},
          "emailAddress":"test1_s1@gedu.demo.rockerz.xyz"
        }
    }
  ]}

=end