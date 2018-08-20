class NotificationsController < ApplicationController
  def index
    notification_owner = current_user                  if current_user.student?
    notification_owner = current_user.students_i_teach if current_user.teacher?

    @notifications = Notification.includes(:user).where(user: notification_owner)
  end
end
