module GoogleIntegration::Classroom::Parsers::Students

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

  def self.run(response)
    x = JSON.parse(response.body)
    student_data = x['students'].map do |hash|
      self.parse_hash(hash)
    end
  end

  private

  def self.parse_hash(hash)
    profile_data = hash['profile']
    {
      name: profile_data['name']['fullName'],
      last_name: profile_data['name']['familyName'], # we will use for their initial password
      email: profile_data['emailAddress']
    }
  end
end