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
    student_data
      .map { |k, v| create_student(student_data[k]) }
      .compact
  end

  def self.create_student(data, counter=0)
    return nil if data[:email].nil?
    return nil if counter > 2

    update_existing_student_with_google_id_and_different_email(data)

    student = User.find_or_initialize_by(email: data[:email].downcase)

    if student.new_record?
      student.update(
        name: data[:name],
        role: 'student',
        password: data[:last_name],
        username: generate_username(data),
        signed_up_with_google: true
      )
    else
      student.update(
        account_type: 'Google Classroom',
        google_id: data[:google_id]
      )
    end

    if student.errors.any?
      student = create_student(data, counter += 1)
    else
      assign_students_to_classrooms(student, data[:classrooms])
    end

    student
  end

  def self.save_student_with_google_info(data)
    student
  end

  def self.update_existing_student_with_google_id_and_different_email(data)
    student = User.find_by(google_id: data[:google_id])
    email = data[:email].downcase

    return if student.nil?
    return if student.email == email
    return if User.find_by(email: email)

    student.update(email: email)
  end

  def self.assign_students_to_classrooms(student, classroom_ids)
    classroom_ids
      .map { |id| Classroom.find(id) }
      .each { |classroom| Associators::StudentsToClassrooms.run(student, classroom) }
  end

  def self.generate_username(data)
    classroom = Classroom.unscoped.find(data[:classrooms].first)

    GenerateUsername.new(
      data[:first_name],
      data[:last_name],
      classroom.code
    ).call
  end
end
