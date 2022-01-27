# frozen_string_literal: true

class GoogleStudentImporterWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::CRITICAL_EXTERNAL

  PUSHER_EVENT_CHANNEL = 'google-classroom-students-imported'

  def perform(teacher_id, context = "none", selected_classroom_ids=nil)
    teacher = User.find(teacher_id)
    return unless teacher.google_authorized?

    GoogleIntegration::TeacherClassroomsStudentsImporter.run(teacher, selected_classroom_ids)
    PusherTrigger.run(teacher_id, PUSHER_EVENT_CHANNEL, "Google classroom students imported for #{teacher_id}.")
  rescue StandardError => e
    NewRelic::Agent.notice_error(e, context: context)
  end
end
