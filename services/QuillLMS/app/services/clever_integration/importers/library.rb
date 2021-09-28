module CleverIntegration::Importers::Library
  def self.run(auth_hash)
    client = CleverLibrary::Api::Client.new(auth_hash.credentials.token)
    user = import_teacher(client)

    if auth_hash[:info][:user_type] == 'teacher'
      classrooms = import_classrooms(client, user.clever_id)
      CleverIntegration::Associators::ClassroomsToTeacher.run(classrooms, user)
      CleverLibraryStudentImporterWorker.perform_async(classrooms.map(&:id), auth_hash.credentials.token)
    elsif auth_hash[:info][:user_type] == 'school_admin'
      import_schools(client, user.clever_id)
    end
    { type: 'user_success', data: user }
  rescue
    {type: 'user_failure', data: 'Error: ' + $!.message}
  end

  def self.import_teacher(client)
    teacher_id = client.user()['id']
    teacher_data = client.get_teacher(teacher_id: teacher_id)
    CleverIntegration::Creators::Teacher.run(
      email: teacher_data['email'],
      name: "#{teacher_data['name']['first']} #{teacher_data['name']['middle']} #{teacher_data['name']['last']}".squish,
      clever_id: teacher_data['id']
    )
  end

  def self.import_classrooms(client, teacher_id)
    client
      .get_teacher_sections(teacher_id: teacher_id)
      .map { |section| { clever_id: section['id'], name: section['name'], grade: section['grade'] } }
      .map { |section_data| CleverIntegration::ClassroomImporter.new(section_data).run }
  end

  def self.import_schools(client, user_id)
    client
      .get_school_admin_schools(school_admin_id: user_id)
      .map { |school_data| CleverIntegration::Creators::School.run(school_data) }
      .each { |school| SchoolsAdmins.create(school_id: school.id, user_id: user_id) }
  end
end
