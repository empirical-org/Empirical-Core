# frozen_string_literal: true

module GoogleIntegration
  class ImportTeacherClassroomsStudentsWorker
    include Sidekiq::Worker
    sidekiq_options queue: SidekiqQueue::CRITICAL_EXTERNAL

    PUSHER_EVENT = 'google-teacher-classrooms-students-imported'
    PUSHER_FAILED_EVENT = 'google-account-reauthorization-required'

    def perform(teacher_id, selected_classroom_ids = nil)
      teacher = ::User.find(teacher_id)

      if teacher.google_authorized?
        TeacherClassroomsStudentsImporter.run(teacher, selected_classroom_ids)
        PusherTrigger.run(teacher_id, PUSHER_EVENT, "Google classroom students imported for #{teacher_id}.")
      else
        PusherTrigger.run(teacher_id, PUSHER_FAILED_EVENT, "Reauthorization needed for user #{teacher_id}.")
      end
    rescue => e
      ErrorNotifier.report(e)
    end
  end
end
