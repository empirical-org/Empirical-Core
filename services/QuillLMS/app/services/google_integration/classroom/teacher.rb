module GoogleIntegration::Classroom::Teacher

  def self.run(user, courses)
    GoogleIntegration::Classroom::Creators::Classrooms.run(user, courses)
    GoogleStudentImporterWorker.perform_async(
      user.id,
      'GoogleIntegration::Classroom::Teacher'
    )
  end

end
