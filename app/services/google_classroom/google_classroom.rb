# when a teacher with google classroom signs up,
# request courses (course = classroom) and create corresponding classroom
# request students for each course, create corresponding users
require 'google/api_client'

# Look at the old API snippet here -
#https://github.com/google/google-api-ruby-client/blob/master/MIGRATING.md
module GoogleClassroom::GoogleClassroom

  def self.pull_classrooms_and_students(teacher)

  end

  def self.test
    x = Google::APIClient.new(application_name: 'quill')
    service = x.discovered_api('classroom', 'v1')
  end

end