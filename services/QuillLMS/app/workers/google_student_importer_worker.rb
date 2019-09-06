class GoogleStudentImporterWorker
  include Sidekiq::Worker
  sidekiq_options queue: 'critical'

  def perform(teacher_id, context = "none", selected_classrooms=nil)
    begin
      teacher = User.find(teacher_id)
      client = google_client(teacher)
      students_requester = google_students_requester.generate(client)
      classrooms = selected_classrooms ? selected_classrooms : teacher.google_classrooms.to_a
      google_students_creator.run(classrooms, students_requester)
      puts 'WHAT THE HELL'
      PusherGoogleClassroomStudentsImported.run(teacher_id)
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
