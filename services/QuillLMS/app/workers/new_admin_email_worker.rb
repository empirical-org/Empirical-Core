class NewAdminEmailWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::LOW

  def perform(user_id, school_id)
    @user = User.find(user_id)
    @school = School.find(school_id)
    @user.send_new_admin_email(@school)
  end
end
