# frozen_string_literal: true

module GoogleIntegration
  class ImportClassroomStudentsWorker
    include Sidekiq::Worker
    sidekiq_options queue: SidekiqQueue::CRITICAL_EXTERNAL

    PUSHER_EVENT = 'google-classroom-students-imported'
    PUSHER_FAILED_EVENT = 'google-account-reauthorization-required'

    attr_reader :teacher_id

    def perform(teacher_id, selected_classroom_ids = nil)
      @teacher_id = teacher_id

      if teacher.google_authorized?
        TeacherClassroomsStudentsImporter.run(teacher, selected_classroom_ids)
        PusherTrigger.run(teacher_id, PUSHER_EVENT, "Google classroom students imported for #{teacher_id}.")
      else
        PusherTrigger.run(teacher_id, PUSHER_FAILED_EVENT, "Reauthorization needed for user #{teacher_id}.")
      end
    rescue => e
      ErrorNotifier.report(e)
    end

    private def teacher
      @teacher ||= ::User.find(teacher_id)
    end
  end
end
