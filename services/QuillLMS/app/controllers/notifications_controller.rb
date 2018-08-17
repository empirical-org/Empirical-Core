class NotificationsController < ApplicationController
  def index
    @notifications = Notification.where(user: current_user)
  end
end
