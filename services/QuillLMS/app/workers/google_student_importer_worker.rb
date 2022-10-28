# frozen_string_literal: true

class GoogleStudentImporterWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::CRITICAL_EXTERNAL

  PUSHER_EVENT = 'google-classroom-students-imported'
  PUSHER_FAILED_EVENT = 'google-account-reauthorization-required'

  def perform(teacher_id, context = "none", selected_classroom_ids=nil)
    teacher = User.find(teacher_id)

    if teacher.google_authorized?
      GoogleIntegration::TeacherClassroomsStudentsImporter.run(teacher, selected_classroom_ids)
      PusherTrigger.run(teacher_id, PUSHER_EVENT, "Google classroom students imported for #{teacher_id}.")
    else
      PusherTrigger.run(teacher_id, PUSHER_FAILED_EVENT, "Reauthorization needed for user #{teacher_id}.")
    end
  rescue => e
    ErrorNotifier.report(e, context: context)
  end
end
