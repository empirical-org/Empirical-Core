class UserSubscription < ActiveRecord::Base
  validates :user_id, :subscription_id, presence: true
  belongs_to :user
  belongs_to :subscription
  after_create :send_premium_emails

  def self.update_or_create(user_id, subscription_id)
    user_sub = self.find_or_initialize_by(user_id: user_id)
    user_sub.subscription_id = subscription_id
    user_sub.save!
  end

  def send_premium_emails
    if subscription.account_type.downcase != 'teacher trial' && subscription.school_subscriptions.empty?
      PremiumUserSubscriptionEmailWorker.perform_async(user_id)
    end
  end

end
