# frozen_string_literal: true

class UpdateStudentLastActiveWorker
  include Sidekiq::Worker

  def perform(user_id, last_active_datetime)
    @user = User.find_by(id: user_id)
    @user.update(last_active: last_active_datetime) if @user
  end
end
