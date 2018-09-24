class NotificationsController < ApplicationController
  def index
    @notifications = Notification.includes(:user).where(user: current_user)
  end
end
