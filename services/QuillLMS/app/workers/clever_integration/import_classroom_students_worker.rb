# frozen_string_literal: true

module CleverIntegration
  class ImportClassroomStudentsWorker
    include Sidekiq::Worker
    sidekiq_options queue: SidekiqQueue::CRITICAL_EXTERNAL

    PUSHER_EVENT = 'clever-classroom-students-imported'

    def perform(teacher_id, classroom_ids)
      teacher = User.find_by(id: teacher_id)
      return if teacher.nil? || classroom_ids.empty?

      TeacherClassroomsStudentsImporter.run(teacher, classroom_ids)
      PusherTrigger.run(teacher_id, PUSHER_EVENT, "clever classroom students imported for #{teacher_id}.")
    rescue => e
      ErrorNotifier.report(e, user_id: teacher_id)
    end
  end
end
