class GoogleStudentImporterWorker
  include Sidekiq::Worker

  def perform(teacher_id)
    teacher = User.find(teacher_id)
    client = GoogleIntegration::Client.new(teacher).create
    students_requester = GoogleIntegration::Classroom::Requesters::Students.generate(client)
    classrooms = User.find(teacher_id).google_classrooms.to_a
    GoogleIntegration::Classroom::Creators::Students.run(classrooms, students_requester)
  end
end
