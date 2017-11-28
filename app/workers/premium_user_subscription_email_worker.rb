class PremiumUserSubscriptionEmailWorker
  include Sidekiq::Worker

  def perform(user_id)
    @user = User.find(user_id)
    @user.send_premium_user_subscription_email
  end
end
