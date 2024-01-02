# frozen_string_literal: true

module TeacherNotifications
  class SendRollupEmailWorker
    include Sidekiq::Worker

    def perform(user_id)
      user = User.find_by(id: user_id)
      notifications = TeacherNotification.where(user: user, email_sent: nil)
      return if notifications.empty?

      TeacherNotifications::RollupMailer.rollup(user, notifications).deliver_now!
      notifications.update_all(email_sent: DateTime.current, updated_at: DateTime.current)
    end
  end
end
