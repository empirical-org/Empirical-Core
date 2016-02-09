module GoogleIntegration::Classroom::Creators::Students

  def self.run(classrooms, students_requester)
    students_requester_and_parser = self.students_requester_and_parser(students_requester)
    student_data = self.get_student_data_for_all_classrooms(classrooms, students_requester_and_parser)
    self.create_students(classrooms, student_data)
  end

  private

  def self.students_requester_and_parser(students_requester)
    lambda do |course_id|
      response = students_requester.call(course_id)
      parsed_response = GoogleIntegration::Classroom::Parsers::Students.run(response)
      parsed_response
    end
  end

  def self.get_student_data_for_all_classrooms(classrooms, students_requester_and_parser)
    course_ids = classrooms.map(&:google_classroom_id)
    student_data = course_ids.map do |course_id|
      students_requester_and_parser.call(course_id)
    end
    student_data
  end

  def self.create_students(classrooms, student_data)
    student_data.each_with_index do |sd, i|
      classroom = classrooms[i]
      self.create_student(sd, classroom)
    end
  end

  def self.create_student(data, classroom)
    student = User.find_or_initialize_by(email: data[:email])
    return if not student.new_record?
    student.update(name: data[:name], classcode: classroom.code)
  end

end