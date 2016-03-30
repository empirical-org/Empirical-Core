module GoogleIntegration::Classroom::Creators::Students

  def self.run(classrooms, students_requester)
    students_requester_and_parser = self.students_requester_and_parser(students_requester)
    student_data = self.get_student_data_for_all_classrooms(classrooms, students_requester_and_parser)
    students = self.create_students(classrooms, student_data)
    students
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
    student_data = course_ids.map.with_index do |course_id, i|
      array = students_requester_and_parser.call(course_id)
      array.map{|ele| ele.merge({classroom: classrooms[i]}) }
    end
    student_data.flatten
  end

  def self.create_students(classrooms, student_data)
    students = student_data.map do |sd|
      self.create_student(sd)
    end
    students.compact
  end

  def self.create_student(data)
    student = ::User.find_or_initialize_by(email: data[:email])
    if student.new_record?
      username = UsernameGenerator.run(data[:first_name], data[:last_name], data[:classroom].code)
      student.update(name: data[:name],
                     role: 'student',
                     password: data[:last_name],
                     username: username)
    end
    Associators::StudentsToClassrooms.run(student, data[:classroom])
    student
  end

end