module GoogleIntegration::Classroom::Teacher::CreateStudents::Main

  def self.run(client, classrooms)
    student_data = self.get_student_data_for_all_classrooms(client, classrooms)
    self.create_students(classrooms, student_data)
  end

  private

  def self.get_student_data_for_all_classrooms(client, classrooms)
    course_ids = classrooms.map(&:google_classroom_id)
    student_data = course_ids.map do |course_id|
      self.get_students_for_course(client, course_id)
    end
  end

  def self.get_students_for_course(client, course_id)
    GoogleIntegration::Classroom::CreateStudents::Get.run(client, course_id)
  end

  def self.create_students(classrooms, student_data)
    student_data.each_with_index do |sd, i|
      classroom = classrooms[i]
      student = User.create(name: student_data[:name],
                            email: student_data[:email],
                            classcode: classroom.code)
    end
  end

end