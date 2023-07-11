# frozen_string_literal: true

module CleverIntegration
  class ImportTeacherClassroomsStudentsWorker
    include Sidekiq::Worker
    sidekiq_options queue: SidekiqQueue::CRITICAL_EXTERNAL

    PUSHER_EVENT = 'clever-classroom-students-imported'
    PUSHER_FAILED_EVENT = 'clever-account-reauthorization-required'

    def perform(teacher_id, selected_classroom_ids = nil)
      teacher = ::User.find(teacher_id)

      if teacher.clever_authorized?
        TeacherClassroomsStudentsImporter.run(teacher, selected_classroom_ids)
        PusherTrigger.run(teacher_id, PUSHER_EVENT, "Clever classroom students imported for #{teacher_id}.")
      else
        PusherTrigger.run(teacher_id, PUSHER_FAILED_EVENT, "Reauthorization needed for user #{teacher_id}.")
      end
    rescue => e
      ErrorNotifier.report(e)
    end
  end
end
