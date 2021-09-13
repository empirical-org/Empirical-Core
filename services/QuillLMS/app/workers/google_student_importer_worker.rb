class GoogleStudentImporterWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::CRITICAL_EXTERNAL

  def perform(teacher_id, context = "none", selected_classroom_ids=nil)
    teacher = User.find(teacher_id)
    GoogleIntegration::TeacherClassroomsStudentsImporter.new(teacher, selected_classroom_ids).run
    PusherTrigger.run(teacher_id, 'google-classroom-students-imported', "Google classroom students imported for #{teacher_id}.")
  rescue StandardError => e
    if Rails.env.development?
      puts 'ERROR', e
    else
      NewRelic::Agent.notice_error(e, custom_params: { context: context })
    end
  end
end
