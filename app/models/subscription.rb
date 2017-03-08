class Subscription < ActiveRecord::Base
  belongs_to :user
  validates :expiration, presence: true
  validates :account_limit, presence: true

  def self.start_premium current_user
    subscription = Subscription.find_by_user_id current_user.id
    # if a subscription already exists, we just update it by adding an additional 365 days to the expiration
    if subscription
      subscription.update(expiration: [subscription.expiration + 365, Date.new(2018, 7, 1)].max, account_limit: 1000, account_type: 'paid')
    else
      self.create(user_id: current_user.id, expiration: [Date.today + 365, Date.new(2018, 7, 1)].max, account_limit: 1000, account_type: 'paid')
    end
    PremiumAnalyticsWorker.perform_async(current_user.id, 'paid')
  end

  def is_not_paid?
    self.account_type == 'trial'
  end

  def trial_or_paid
    is_not_paid? ? 'trial' : 'paid'
  end

end
