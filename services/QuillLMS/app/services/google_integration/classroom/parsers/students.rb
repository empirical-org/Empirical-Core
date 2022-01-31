# frozen_string_literal: true

module GoogleIntegration::Classroom::Parsers::Students

  # example result of JSON.parse(response.body) :
  #
  # {"students":
  #   [
  #     {"courseId":"455798942",
  #      "userId":"107708392406225674265",
  #      "profile":
  #         {"id":"107708392406225674265",
  #          "name":
  #           {"givenName":"test1_s1",
  #            "familyName":"s1",
  #            "fullName":"test1_s1 s1"},
  #           "emailAddress":"test1_s1@gedu.demo.rockerz.xyz"
  #         }
  #     }
  #   ]}
  #

  def self.run(students)
    return [] if !students || !students.length

    student_data = students.map do |hash|
      parse_hash(hash)
    end
  end

  def self.parse_hash(hash)
    profile_data = hash['profile']
    {
      name: profile_data['name']['fullName'],
      first_name: profile_data['name']['givenName'],
      last_name: profile_data['name']['familyName'], # we will use for their initial password
      email: profile_data['emailAddress'],
      google_id: profile_data['id']
    }
  end
end
