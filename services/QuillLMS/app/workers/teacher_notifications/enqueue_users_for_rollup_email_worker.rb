# frozen_string_literal: true

module TeacherNotifications
  class EnqueueUsersForRollupEmailWorker
    include Sidekiq::Worker

    def perform(frequency)
      TeacherInfo.includes(:user).where(notification_email_frequency: frequency).pluck("users.id").each do |user_id|
        TeacherNotifications::SendRollupEmailWorker.perform_async(user_id)
      end
    end
  end
end

