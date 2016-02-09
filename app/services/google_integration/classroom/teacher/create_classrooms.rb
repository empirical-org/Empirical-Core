module GoogleIntegration::Classroom::Teacher::CreateClassrooms

  def self.run(user, client, course_getter)
    courses = course_getter.run(client)
    classrooms = self.create_classrooms(courses)
  end

  private

  def self.create_classrooms(courses)
    courses.map{ |course| self.create_classroom(course) }
           .compact
  end

  def self.create_classroom(courses)
    classroom = Classroom.find_or_initialize_by(google_classroom_id: course[:id])
    if classroom.new_record?
      classroom.name = course[:name]
      classroom.save
      result = classroom.reload
    else
      result = nil
    end
    result
  end

end