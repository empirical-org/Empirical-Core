class GoogleStudentImporterWorker
  include Sidekiq::Worker

  def perform(teacher_id, context = "none")
    begin
      teacher = User.find(teacher_id)
      client = google_client(teacher)
      students_requester = google_students_requester.generate(client)
      classrooms = teacher.google_classrooms.to_a
      google_students_creator.run(classrooms, students_requester)
    rescue StandardError => e
      NewRelic::Agent.notice_error(e, custom_params: { context: context })
    end
  end

  private

  def google_client(teacher)
    GoogleIntegration::Client.new(teacher).create
  end

  def google_students_requester
    GoogleIntegration::Classroom::Requesters::Students
  end

  def google_students_creator
    GoogleIntegration::Classroom::Creators::Students
  end
end
