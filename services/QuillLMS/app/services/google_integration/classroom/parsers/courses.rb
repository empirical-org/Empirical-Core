# frozen_string_literal: true

module GoogleIntegration::Classroom::Parsers::Courses


  # example JSON.parse(response.body) :
  #
  # {"id"=>"5169992618", "name"=>"archive test", "descriptionHeading"=>"archive test", "ownerId"=>"112188393285935083024", "creationTime"=>"2017-03-16T19:09:15.524Z", "updateTime"=>"2017-03-16T19:10:21.493Z", "enrollmentCode"=>"csaous", "courseState"=>"ARCHIVED", "alternateLink"=>"http://classroom.google.com/c/NTE2OTk5MjYxOFpa", "teacherGroupEmail"=>"archive_test_teachers_d85e9a6a@quill.org", "courseGroupEmail"=>"archive_test_732f640d@quill.org", "teacherFolder"=>{"id"=>"0B42XhC1mwehmfkI2aDBsc2dxbS1RSGxmdXBJd3lmYU9OQU1ob2VwUTgtRkhPSGZzWmxCMTg", "title"=>"archive test", "alternateLink"=>"https://drive.google.com/drive/folders/0B42XhC1mwehmfkI2aDBsc2dxbS1RSGxmdXBJd3lmYU9OQU1ob2VwUTgtRkhPSGZzWmxCMTg"}, "guardiansEnabled"=>false}
  #

  def self.run(user, course_response, student_requester)
    if user.teacher?
      parse_courses_for_teacher(course_response, user, student_requester)
    else
      parse_courses_for_student(course_response, user)
    end
  end

  def self.parse_courses_for_teacher(course_response, user, student_requester)
    courses = []
    if course_response[:courses] && course_response[:courses].any?
      existing_google_classroom_ids = existing_google_classroom_ids(user)
      course_response[:courses].each do |course|
        already_imported = already_imported?(course, existing_google_classroom_ids)
        if already_imported
          grade = Classroom.unscoped.find_by(google_classroom_id: course[:id]).grade
        end
        if valid?(course, user, existing_google_classroom_ids)
          students = student_requester.call(course[:id])
          name = course[:section] ? "#{course[:name]} #{course[:section]}" : course[:name]
          courses << {
            id: course[:id].to_i, name: name,
            ownerId: course[:ownerId],
            section: course[:section],
            alreadyImported: already_imported,
            grade: grade,
            creationTime: course[:creationTime],
            studentCount: students.count
          }
        end
      end
    end
    courses
  end

  def self.parse_courses_for_student(course_response, user)
    course_ids = []
    if course_response[:courses] && course_response[:courses].any?
      # checking to make sure student is not the owner (teacher) of the course
      course_response[:courses].reject{ |c| own_course(c, user) }.each do |course|
        course_ids << course[:id]
      end
    end
    course_ids
  end

  def self.existing_google_classroom_ids(user)
    User.find(user.id).google_classrooms.map(&:google_classroom_id)
  end

  def self.valid?(course, user, existing_google_classroom_ids)
    # really we should be calling google classrooms api to see if this user is a teacher,
    # but we are using an outdated method of calling the api elsewhere
    # and need to do a more robust overhaul for this to make sense
    # self.own_course(course, user) && (self.not_archived(course) || course[:alreadyImported])
    not_archived(course) || course[:alreadyImported]
  end

  def self.own_course(course, user)
    course[:ownerId] == user.google_id
  end

  def self.not_archived(course)
    course[:courseState] != 'ARCHIVED'
  end

  def self.already_imported?(course, existing_google_classroom_ids)
    existing_google_classroom_ids.include?(course[:id].to_i)
  end

end
