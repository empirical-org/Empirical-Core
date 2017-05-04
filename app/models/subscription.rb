class Subscription < ActiveRecord::Base
  has_many :user_subscriptions
  validates :expiration, presence: true
  validates :account_limit, presence: true

  def self.start_premium user_id
    user_sub = UserSubscription.find_or_initialize_by(user_id: user_id)
    # if a subscription already exists, we just update it by adding an additional 365 days to the expiration
    if user_sub.new_record?
      new_sub = self.create!(expiration: [Date.today + 365, Date.new(2018, 7, 1)].max, account_limit: 1000, account_type: 'paid')
      user_sub.update!(subscription_id: new_sub.id)
      user_sub.save!
    else
      user_sub.subscription.update!(expiration: [user_sub.subscription.expiration + 365, Date.new(2018, 7, 1)].max, account_limit: 1000, account_type: 'paid')
    end
    PremiumAnalyticsWorker.perform_async(user_sub.user_id, 'paid')
  end

  def is_not_paid?
    self.account_type == 'trial'
  end

  def trial_or_paid
    is_not_paid? ? 'trial' : 'paid'
  end

end
