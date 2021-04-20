module GoogleIntegration::Classroom::Creators::Students

  def self.run(classrooms, students_requester)
    students_requester_and_parser = self.students_requester_and_parser(students_requester)
    student_data = get_student_data_for_all_classrooms(classrooms, students_requester_and_parser)
    students = create_students(student_data)
    students.compact
  end

  def self.students_requester_and_parser(students_requester)
    lambda do |course_id|
      response = students_requester.call(course_id)
      parsed_response = GoogleIntegration::Classroom::Parsers::Students.run(response)
      parsed_response
    end
  end

  def self.get_student_data_for_all_classrooms(classrooms, students_requester_and_parser)
    #use string keys as the classrooms are coming through sidekiq and don't have symbols
    course_ids = classrooms.map{|classroom| classroom["google_classroom_id"] || classroom["id"]}
    # FIXME: there is probably a more performant way to do this. I hijacked it from the
    # old method that waas here in order to avoid the race conditions in student
    # account creation that were occurring when we revisit google classrooms, we should redo this
    students_by_email = {}
    student_data = course_ids.map.with_index do |course_id, i|
      students = students_requester_and_parser.call(course_id)
      students.each do |student|
        students_by_email[student[:email]] ||= student
        students_by_email[student[:email]][:classrooms] ||= []
        students_by_email[student[:email]][:classrooms].push(classrooms[i]['id'])
      end
    end
    students_by_email
  end

  def self.create_students(student_data)
    students = student_data.map do |k, v|
      create_student(student_data[k])
    end
    students.compact
  end

  def self.create_student(data, counter=0)
    if counter > 2
      return nil
    end
    if data[:email]
      student = User.find_or_initialize_by(email: data[:email].downcase)
      if student.new_record?
        classroom = Classroom.unscoped.find(data[:classrooms].first)
        username = GenerateUsername.new(
          data[:first_name],
          data[:last_name],
          classroom.code
        ).call
        student.update(name: data[:name],
                       role: 'student',
                       password: data[:last_name],
                       username: username,
                       signed_up_with_google: true,
                       account_type: 'Google Classroom',
                       google_id: data[:google_id]
                      )
      else
        student.update(account_type: 'Google Classroom', google_id: data[:google_id])
      end

      if student.errors.any?
        student = create_student(data, counter += 1)
      else
        data[:classrooms].each do |id|
          classroom = Classroom.find(id)
          Associators::StudentsToClassrooms.run(student, classroom)
        end
      end
      student
    end
  end



end
