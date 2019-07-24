class PremiumMissingSchoolEmailWorker
  include Sidekiq::Worker

  def perform(user_id)
    @user = User.find(user_id)
    @user.send_premium_school_missing_email
  end
end
