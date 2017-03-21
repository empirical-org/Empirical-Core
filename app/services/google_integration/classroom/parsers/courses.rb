module GoogleIntegration::Classroom::Parsers::Courses


=begin
example JSON.parse(response.body) :

{"courses":[{"id":"455798942","name":"class1","ownerId":"117520115627269298978","creationTime":"2016-02-01T21:19:54.662Z","updateTime":"2016-02-01T21:20:39.424Z","enrollmentCode":"w5o4h0v","courseState":"ACTIVE","alternateLink":"http://classroom.google.com/c/NDU1Nzk4OTQy"}]}

=end

  def self.run(user, response)
    course_response = JSON.parse(response.body)
    courses = []
    if ['courses'].any?
      existing_google_classroom_ids = self.existing_google_classroom_ids(user)
      course_response['courses'].each do |course|
        course['alreadyImported'] = self.already_imported?(course, existing_google_classroom_ids)
        if self.valid?(course, user, existing_google_classroom_ids)
          name = course['section'] ? "#{course['name']} #{course['section']}" : course['name']
          courses << {id: course['id'].to_i, name: name, ownerId: course['ownerId'], alreadyImported: course['alreadyImported']}
        end
      end
    end
    courses
  end

  def self.existing_google_classroom_ids(user)
    User.find(user.id).google_classrooms.map(&:google_classroom_id)
  end

  def self.valid?(course, user, existing_google_classroom_ids)
    self.own_course(course, user) && (self.not_archived(course) || course['alreadyImported'])
  end

  def self.own_course(course, user)
    course['ownerId'] == user.google_id
  end

  def self.not_archived(course)
    course['courseState'] != 'ARCHIVED'
  end

  def self.already_imported?(course, existing_google_classroom_ids)
    existing_google_classroom_ids.include?(course['id'])
  end

end
