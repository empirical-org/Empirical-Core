module GoogleIntegration::Classroom::Teacher

  def self.run(user, courses, access_token)
    classrooms = self.create_classrooms(user, courses)
    students   = self.create_students(classrooms, access_token)
  end

  private

  def self.create_classrooms(user, courses)
    GoogleIntegration::Classroom::Creators::Classrooms.run(user, courses)
  end

  def self.create_students(classrooms, access_token)
    # can't pass the actual classroom objects to SideKiq -- so we pass them as an array of hashes
    classrooms = classrooms.map(&:attributes)
    GoogleStudentImporterWorker.perform_async(classrooms, access_token)
  end
end
