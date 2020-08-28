class GoogleStudentImporterWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::CRITICAL

  def perform(teacher_id, context = "none", selected_classroom_ids=nil)
    begin
      teacher = User.find(teacher_id)
      client = google_client(teacher)
      students_requester = google_students_requester.generate(client)
      classrooms = selected_classroom_ids ? Classroom.where(id: selected_classroom_ids) : teacher.google_classrooms.to_a
      google_students_creator.run(classrooms, students_requester)
      PusherTrigger.run(teacher_id, 'google-classroom-students-imported', "Google classroom students imported for #{teacher_id}.")
    rescue StandardError => e
      if Rails.env.development?
        puts 'ERROR', e
      else
        NewRelic::Agent.notice_error(e, custom_params: { context: context })
      end
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
