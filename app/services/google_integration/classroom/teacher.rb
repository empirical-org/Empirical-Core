module GoogleIntegration::Classroom::Teacher

  def self.run(user, courses, access_token)
    GoogleIntegration::Classroom::Creators::Classrooms.run(user, courses)
    GoogleStudentImporterWorker.perform_async(user.id, access_token)
  end

end
