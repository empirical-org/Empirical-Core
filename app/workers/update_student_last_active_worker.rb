class UpdateStudentLastActiveWorker
  include Sidekiq::Worker

  def perform(user_id, last_active_datetime)
    @user = User.find(user_id)
    @user.update(last_active: last_active_datetime)
  end
end
