module CleverIntegration::Importers::Library

  def self.run(auth_hash)
    begin
      client = CleverLibrary::Api::Client.new(auth_hash.credentials.token)
      user = import_teacher(client)
      if auth_hash[:info][:user_type] == 'teacher'
        classrooms = import_classrooms(client, user.clever_id)
        CleverIntegration::Associators::ClassroomsToTeacher.run(classrooms, user)
        CleverLibraryStudentImporterWorker.perform_async(classrooms.map(&:id), auth_hash.credentials.token)
      elsif auth_hash[:info][:user_type] == 'school_admin'
        import_schools(client, user.clever_id)
      end
      {type: 'user_success', data: user}
    end
  rescue
    {type: 'user_failure', data: "Error: " + $!.message}
  end

  def self.import_teacher(client)
    teacher_id = client.user()["id"]
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

  def self.import_schools(client, user_id)
    schools_data = client.get_school_admin_schools(school_admin_id: user_id)
    schools = schools_data.map do |school|
      CleverIntegration::Creators::School.run(school)
    end
    schools.each { |school| SchoolsAdmins.create(school_id: school.id, user_id: user_id)}
  end

end
