class GoogleStudentImporterWorker
  include Sidekiq::Worker

  def perform(teacher_id, access_token)
    client = GoogleIntegration::Client.create(access_token)
    students_requester = GoogleIntegration::Classroom::Requesters::Students.generate(client)
    classrooms = User.find(teacher_id).google_classrooms.to_a
    GoogleIntegration::Classroom::Creators::Students.run(classrooms, students_requester)
  end
end
