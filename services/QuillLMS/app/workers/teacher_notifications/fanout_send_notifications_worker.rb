# frozen_string_literal: true

module TeacherNotifications
  class FanoutSendNotificationsWorker
    include Sidekiq::Worker

    FANOUT_WORKERS = [
      SendCompleteDiagnosticNotificationWorker,
      SendCompleteAllDiagnosticRecommendationsNotificationWorker,
      SendCompleteAllAssignedActivitiesNotificationWorker
    ]

    def perform(activity_session_id)
      FANOUT_WORKERS.each do |worker|
        worker.perform_async(activity_session_id)
      end
    end
  end
end
