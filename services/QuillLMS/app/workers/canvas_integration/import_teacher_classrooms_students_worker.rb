# frozen_string_literal: true

module CanvasIntegration
  class ImportTeacherClassroomsStudentsWorker
    include Sidekiq::Worker
    sidekiq_options queue: SidekiqQueue::CRITICAL_EXTERNAL

    PUSHER_EVENT = 'canvas-classroom-students-imported'
    PUSHER_FAILED_EVENT = 'canvas-account-reauthorization-required'

    def perform(teacher_id, selected_classroom_ids = nil)
      teacher = ::User.find(teacher_id)

      if teacher.canvas_authorized?
        TeacherClassroomsStudentsImporter.run(teacher, selected_classroom_ids)
        SendPusherMessageWorker.perform_async(teacher_id, PUSHER_EVENT, "Canvas classroom students imported for #{teacher_id}.")
      else
        SendPusherMessageWorker.perform_async(teacher_id, PUSHER_FAILED_EVENT, "Reauthorization needed for user #{teacher_id}.")
      end
    rescue => e
      ErrorNotifier.report(e)
    end
  end
end
