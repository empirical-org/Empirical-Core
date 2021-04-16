module CleverIntegration::Creators::Students

  def self.run(parsed_students_response)
    students = parsed_students_response.map do |parsed_student_response|
      student = create_student(parsed_student_response)
      student
    end
    students
  end

  def self.create_student(parsed_student_response)
    if parsed_student_response[:email].present?
      student = User.find_by(email: parsed_student_response[:email])
    else
      student = nil
    end

    if student
      student.clever_id = parsed_student_response[:clever_id]
    else
      student = User.find_or_initialize_by(clever_id: parsed_student_response[:clever_id])
    end

    student.update(parsed_student_response.merge({
      role: 'student',
      account_type: 'Clever'
    }))
    if student.errors.any?
      student.update(parsed_student_response.merge({
        email: nil,
        role: 'student',
        account_type: 'Clever'
      }))
    end
    if student.errors.any?
      student.update(parsed_student_response.merge({
        username: nil,
        role: 'student',
        account_type: 'Clever'
      }))
    end
    student.reload if student.id?
  end
end
