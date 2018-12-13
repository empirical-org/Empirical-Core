module CleverIntegration::Importers::Library
  
  def self.run(auth_hash)
    begin
      client = CleverLibrary::Api::Client.new(auth_hash.credentials.token)
      teacher = self.import_teacher(client)
      classrooms = self.import_classrooms(client, teacher.clever_id)
      CleverIntegration::Associators::ClassroomsToTeacher.run(classrooms, teacher)
      self.import_students(client, classrooms)
      return {type: 'user_success', data: teacher}
    end
  rescue
    {type: 'user_failure', data: "Error: " + $!.message}
  end

  def self.import_teacher(client)
    teacher_id = client.get_user()["id"]
    teacher_data = client.get_teacher(teacher_id: teacher_id)
    CleverIntegration::Creators::Teacher.run(
      email: teacher_data["email"], 
      name: "#{teacher_data['name']['first']} #{teacher_data['name']['middle']} #{teacher_data['name']['last']}".squish,
      clever_id: teacher_data["id"]
    )
  end

  def self.import_classrooms(client, teacher_id)
    classrooms_data = client.get_teacher_sections(teacher_id: teacher_id)
    CleverIntegration::Creators::Classrooms.run(classrooms_data.map{|classroom| {clever_id: classroom["id"], name: classroom["name"], grade: classroom["grade"]} })
  end

  def self.import_students(client, classrooms)
    classrooms.each do |classroom|
      students_data = client.get_section_students(section_id: classroom.clever_id)
      students = CleverIntegration::Creators::Students.run(students_data.map do |student_data|
        {
          clever_id: student_data["id"],
          name: "#{student_data['name']['first']} #{student_data['name']['middle']} #{student_data['name']['last']}".squish,
          username: student_data["id"]
        }
      end)
      CleverIntegration::Associators::StudentsToClassroom.run(students, classroom)
    end
  end

end


