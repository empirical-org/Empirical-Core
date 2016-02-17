module GoogleIntegration::Classroom::Parsers::Courses


=begin
example JSON.parse(response.body) :

{"courses":[{"id":"455798942","name":"class1","ownerId":"117520115627269298978","creationTime":"2016-02-01T21:19:54.662Z","updateTime":"2016-02-01T21:20:39.424Z","enrollmentCode":"w5o4h0v","courseState":"ACTIVE","alternateLink":"http://classroom.google.com/c/NDU1Nzk4OTQy"}]}

=end

  def self.run(response)
    x = JSON.parse(response.body)
    return [] if x['courses'].nil?
    courses = x['courses'].map do |hash|
      {id: hash['id'].to_i, name: hash['name']}
    end
    courses
  end
end