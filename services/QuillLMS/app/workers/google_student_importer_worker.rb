class GoogleStudentImporterWorker
  include Sidekiq::Worker

  def perform(teacher_id, context = "none")
    begin
      teacher = User.find(teacher_id)
      client = GoogleIntegration::Client.new(teacher).create
      students_requester = GoogleIntegration::Classroom::Requesters::Students.generate(client)
      classrooms = teacher.google_classrooms.to_a
      GoogleIntegration::Classroom::Creators::Students.run(classrooms, students_requester)
    rescue StandardError => e
      NewRelic::Agent.notice_error(e, custom_params: { context: context })
    end
  end
end
